import axios from "axios";
import React, { useState } from "react";

import { Button, TextField, Typography } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

import { useForm } from "../../../../../../shared/hooks/useForm";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../../../shared/utils/FormValidator";
import usePasswordSectionStyles from "./PasswordSectionStyles";

interface PasswordSectionProps {}

export const PasswordSection: React.FC<PasswordSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = usePasswordSectionStyles();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      oldPassword: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
      newPassword: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [
          VALIDATOR_REQUIRE(),
          VALIDATOR_MINLENGTH(8),
          VALIDATOR_MAXLENGTH(64),
        ],
        failedRequirements: [],
        errorMessage: "",
        helperText: "Must be 8-64 characters long.",
      },
      confirmNewPassword: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [
          VALIDATOR_REQUIRE(),
          VALIDATOR_MINLENGTH(8),
          VALIDATOR_MAXLENGTH(64),
        ],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
    },
    false
  );

  /**
   * Checks if the two "new password" fields match.
   * @returns True if passwords match, false otherwise.
   */
  const checkNewPasswordsMatch = () => {
    if (
      formState.inputs.newPassword.value ===
      formState.inputs.confirmNewPassword.value
    ) {
      return true;
    } else {
      formDispatch({
        type: "INVALIDATE",
        errorMessage: "New passwords do not match.",
        input: "newPassword",
      });
      formDispatch({
        type: "INVALIDATE",
        errorMessage: "",
        input: "confirmNewPassword",
      });
      return false;
    }
  };

  /**
   * Form submit handler.
   */
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formState.isValid && checkNewPasswordsMatch()) {
      await updatePasswordMutation();
    }
  };
  //#endregion

  //#region Update password mutation ------------------------------------------
  const updatePasswordMutation = async () => {
    await axios
      .post("http://localhost:8000/users/me/password", {
        oldPassword: formState.inputs.oldPassword.value,
        newPassword: formState.inputs.newPassword.value,
      })
      .then((res) => {
        setPasswordUpdateSuccess(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.passwordSection_title} variant="h5">
        Change Password
      </Typography>
      <form
        className={classes.passwordSection_formContainer}
        noValidate
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <Typography
          className={classes.passwordSection_formLabel}
          variant="caption"
        >
          Old password
        </Typography>
        <TextField
          id="oldPassword"
          className={classes.passwordSection_formItem}
          type="password"
          variant="outlined"
          fullWidth
          value={formState.inputs.oldPassword.value}
          onChange={formInputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.oldPassword.isUsed &&
            !formState.inputs.oldPassword.isValid
          }
          helperText={
            formState.inputs.oldPassword.errorMessage &&
            formState.inputs.oldPassword.isUsed
              ? formState.inputs.oldPassword.errorMessage
              : formState.inputs.oldPassword.helperText
          }
        />
        <Typography
          className={classes.passwordSection_formLabel}
          variant="caption"
        >
          New password
        </Typography>
        <TextField
          id="newPassword"
          className={classes.passwordSection_formItem}
          type="password"
          variant="outlined"
          fullWidth
          value={formState.inputs.newPassword.value}
          onChange={formInputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.newPassword.isUsed &&
            !formState.inputs.newPassword.isValid
          }
          helperText={
            formState.inputs.newPassword.errorMessage &&
            formState.inputs.newPassword.isUsed
              ? formState.inputs.newPassword.errorMessage
              : formState.inputs.newPassword.helperText
          }
        />
        <Typography
          className={classes.passwordSection_formLabel}
          variant="caption"
        >
          Confirm new password
        </Typography>
        <TextField
          id="confirmNewPassword"
          className={classes.passwordSection_formItem}
          type="password"
          variant="outlined"
          fullWidth
          value={formState.inputs.confirmNewPassword.value}
          onChange={formInputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.confirmNewPassword.isUsed &&
            !formState.inputs.confirmNewPassword.isValid
          }
          helperText={
            formState.inputs.confirmNewPassword.errorMessage &&
            formState.inputs.confirmNewPassword.isUsed
              ? formState.inputs.confirmNewPassword.errorMessage
              : formState.inputs.confirmNewPassword.helperText
          }
        />
        <div className={classes.passwordSection_buttonContainer}>
          <Button
            className={`${classes.passwordSection_submitButton} ${classes.passwordSection_formItem}`}
            variant="contained"
            color="primary"
            fullWidth
            onClick={submitHandler}
          >
            Update password
          </Button>
          {passwordUpdateSuccess ? <DoneIcon /> : null}
        </div>
      </form>
    </>
  );
  //#endregion
};
