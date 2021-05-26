import axios from "axios";
import React, { useEffect, useState } from "react";

import { Button, TextField, Typography } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

import { useUserContext } from "../../../../../../shared/contexts/UserContext";
import { useForm } from "../../../../../../shared/hooks/useForm";
import {
  VALIDATOR_ALPHA_WHITESPACE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../../../shared/utils/FormValidator";
import usePublicProfileSectionStyles from "./PublicProfileSectionStyles";

interface PublicProfileSectionProps {}

export const PublicProfileSection: React.FC<PublicProfileSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = usePublicProfileSectionStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const [user, setUser]: any = useUserContext();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      fullName: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [
          VALIDATOR_REQUIRE(),
          VALIDATOR_ALPHA_WHITESPACE(),
          VALIDATOR_MAXLENGTH(100),
        ],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
    },
    false
  );

  /**
   * Initialize form with user info
   */
  useEffect(() => {
    if (user) {
      formDispatch({
        type: "CHANGE",
        value: user.name,
        input: "fullName",
      });
    }
  }, [user, formDispatch]);

  /**
   * Handle form input.
   */
  const inputHandler = (e: any) => {
    setProfileUpdateSuccess(false);
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
        setProfileUpdateSuccess(true);
      } catch (error) {}
    }
  };
  //#endregion

  //#region Update user mutation ----------------------------------------------
  const updateUserMutation = async () => {
    await axios
      .patch("http://localhost:8000/users/me", {
        name: formState.inputs.fullName.value,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.publicProfileSection_title} variant="h5">
        Public profile
      </Typography>
      <form
        className={classes.publicProfileSection_formContainer}
        noValidate
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <Typography
          className={classes.publicProfileSection_formLabel}
          variant="caption"
        >
          Full Name
        </Typography>
        <TextField
          className={classes.publicProfileSection_formItem}
          id="fullName"
          variant="outlined"
          value={formState.inputs.fullName.value}
          onChange={inputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.fullName.isUsed &&
            !formState.inputs.fullName.isValid
          }
          helperText={
            formState.inputs.fullName.errorMessage &&
            formState.inputs.fullName.isUsed
              ? formState.inputs.fullName.errorMessage
              : formState.inputs.fullName.helperText
          }
        />
        <div className={classes.publicProfileSection_buttonContainer}>
          <Button
            className={`${classes.publicProfileSection_submitButton} ${classes.publicProfileSection_formItem}`}
            variant="contained"
            color="primary"
            onClick={submitHandler}
          >
            Update Profile
          </Button>
          {profileUpdateSuccess ? <DoneIcon /> : null}
        </div>
      </form>
    </>
  );
  //#endregion
};
