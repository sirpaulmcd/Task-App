import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button, TextField, Typography } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

import { useUserContext } from "../../../../../../shared/contexts/UserContext";
import useAlertDialog from "../../../../../../shared/hooks/useAlertDialog";
import { useForm } from "../../../../../../shared/hooks/useForm";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../../../../../shared/utils/FormValidator";
import useEmailSectionStyles from "./EmailSectionStyles";

interface EmailSectionProps {}

export const EmailSection: React.FC<EmailSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useEmailSectionStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const [user, setUser]: any = useUserContext();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState(false);
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      email: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
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
        value: user.email,
        input: "email",
      });
    }
  }, [user, formDispatch]);

  /**
   * Handle form input.
   */
  const inputHandler = (e: any) => {
    setEmailUpdateSuccess(false);
    formInputHandler(e);
  };

  /**
   * Handle form submission.
   */
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formState.isValid) {
      await updateUserMutation();
    }
  };

  const invalidateEmailField = useCallback(() => {
    formDispatch({
      type: "INVALIDATE",
      errorMessage: "Email is already taken.",
      input: "email",
    });
  }, [formDispatch]);
  //#endregion

  //#region Update user mutation ----------------------------------------------
  const updateUserMutation = async () => {
    await axios
      .patch(`${process.env.REACT_APP_BACKEND_URI}/users/me`, {
        email: formState.inputs.email.value,
      })
      .then((res) => {
        setUser(res.data);
        setEmailUpdateSuccess(true);
      })
      .catch((error) => {
        invalidateEmailField();
      });
  };
  //#endregion

  //#region Unique field query ------------------------------------------------
  const checkUniqueFieldQuery = useCallback(async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/unique`, {
        email: formState.inputs.email.value,
      })
      .catch((error) => {
        if (formState.inputs.email.value !== user.email) {
          invalidateEmailField();
        }
      });
  }, [formState.inputs.email.value, user.email, invalidateEmailField]);

  /**
   * Reference to email text field. Used to check if user is done typing.
   */
  const emailRef = useRef<HTMLInputElement>();

  /**
   * When user has stopped typing for half a second, send query to check if
   * input email is unique.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      let email = formState.inputs.email.value;
      if (email !== user.email && email === emailRef.current?.value) {
        checkUniqueFieldQuery();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [formState.inputs.email.value, user.email, checkUniqueFieldQuery]);
  //#endregion

  //#region Alert dialog ------------------------------------------------------
  const [handleAlertDialogOpen, alertDialogContent]: any = useAlertDialog(
    "",
    "Are you sure you want to change your email?",
    "No",
    "Yes",
    submitHandler
  );

  const handleUpdateButtonPress = () => {
    if (formState.isValid && formState.inputs.email.value !== user.email) {
      handleAlertDialogOpen();
    }
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {alertDialogContent}
      <Typography className={classes.emailSection_title} variant="h5">
        Change email
      </Typography>
      <div className={classes.emailSection_formContainer}>
        <form
          className={classes.emailSection_leftContainer}
          noValidate
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <Typography
            className={classes.emailSection_formLabel}
            variant="caption"
          >
            Email
          </Typography>
          <TextField
            id="email"
            className={classes.emailSection_formItem}
            inputRef={emailRef}
            variant="outlined"
            fullWidth
            value={formState.inputs.email.value}
            onChange={inputHandler}
            onBlur={formBlurHandler}
            error={
              formState.inputs.email.isUsed && !formState.inputs.email.isValid
            }
            helperText={
              formState.inputs.email.errorMessage &&
              formState.inputs.email.isUsed
                ? formState.inputs.email.errorMessage
                : formState.inputs.email.helperText
            }
          />
          <div className={classes.emailSection_buttonContainer}>
            <Button
              className={`${classes.emailSection_submitButton} ${classes.emailSection_formItem}`}
              variant="contained"
              color="primary"
              onClick={handleUpdateButtonPress}
            >
              Update email
            </Button>
            {emailUpdateSuccess ? <DoneIcon /> : null}
          </div>
        </form>
        <div className={classes.emailSection_rightContainer}></div>
      </div>
    </>
  );
  //#endregion
};
