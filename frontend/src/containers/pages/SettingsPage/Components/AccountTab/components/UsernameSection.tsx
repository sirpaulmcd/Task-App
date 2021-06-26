import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button, TextField, Typography } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

import { useUserContext } from "../../../../../../shared/contexts/UserContext";
import { useForm } from "../../../../../../shared/hooks/useForm";
import {
  VALIDATOR_ALPHANUMERIC,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../../../shared/utils/FormValidator";
import useUsernameSectionStyles from "./UsernameSectionStyles";

interface UsernameSectionProps {}

export const UsernameSection: React.FC<UsernameSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useUsernameSectionStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const [user, setUser]: any = useUserContext();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [usernameUpdateSuccess, setUsernameUpdateSuccess] = useState(false);
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      username: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [
          VALIDATOR_REQUIRE(),
          VALIDATOR_ALPHANUMERIC(),
          VALIDATOR_MINLENGTH(6),
          VALIDATOR_MAXLENGTH(50),
        ],
        failedRequirements: [],
        errorMessage: "",
        helperText: "Must be 6-50 characters long.",
      },
    },
    false
  );

  /**
   * Initialize form with user info.
   */
  useEffect(() => {
    if (user) {
      formDispatch({
        type: "CHANGE",
        value: user.username,
        input: "username",
      });
    }
  }, [user, formDispatch]);

  /**
   * Handle form input.
   */
  const inputHandler = (e: any) => {
    setUsernameUpdateSuccess(false);
    formInputHandler(e);
  };

  /**
   * Handle form submission.
   */
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formState.isValid) {
      try {
        await updateUserMutation();
        setUsernameUpdateSuccess(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  //#endregion

  //#region Update user mutation ----------------------------------------------
  const updateUserMutation = async () => {
    await axios
      .patch(`${process.env.REACT_APP_BACKEND_URI}/users/me`, {
        username: formState.inputs.username.value,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Unique username query ---------------------------------------------
  const checkUniqueFieldQuery = useCallback(async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/unique`, {
        username: formState.inputs.username.value,
      })
      .catch((error) => {
        if (formState.inputs.username.value !== user.username) {
          formDispatch({
            type: "INVALIDATE",
            errorMessage: "Username is already taken.",
            input: "username",
          });
        }
      });
  }, [formDispatch, formState.inputs.username.value, user.username]);

  /**
   * Reference to username text field. Used to check if user is done typing.
   */
  const usernameRef = useRef<HTMLInputElement>();

  /**
   * When user has stopped typing for half a second, send query to check if
   * input username is unique.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      let username = formState.inputs.username.value;
      if (
        username !== user.username &&
        username === usernameRef.current?.value
      ) {
        checkUniqueFieldQuery();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [formState.inputs.username.value, user.username, checkUniqueFieldQuery]);
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.usernameSection_title} variant="h5">
        Change username
      </Typography>
      <div className={classes.usernameSection_formContainer}>
        <form
          className={classes.usernameSection_leftContainer}
          noValidate
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <Typography
            className={classes.usernameSection_formLabel}
            variant="caption"
          >
            Username
          </Typography>
          <TextField
            id="username"
            className={classes.usernameSection_formItem}
            inputRef={usernameRef}
            variant="outlined"
            fullWidth
            value={formState.inputs.username.value}
            onChange={inputHandler}
            onBlur={formBlurHandler}
            error={
              formState.inputs.username.isUsed &&
              !formState.inputs.username.isValid
            }
            helperText={
              formState.inputs.username.errorMessage &&
              formState.inputs.username.isUsed
                ? formState.inputs.username.errorMessage
                : formState.inputs.username.helperText
            }
          />
          <div className={classes.usernameSection_buttonContainer}>
            <Button
              className={`${classes.usernameSection_submitButton} ${classes.usernameSection_formItem}`}
              variant="contained"
              color="primary"
              onClick={submitHandler}
            >
              Update username
            </Button>
            {usernameUpdateSuccess ? <DoneIcon /> : null}
          </div>
        </form>
        <div className={classes.usernameSection_rightContainer}></div>
      </div>
    </>
  );
  //#endregion
};
