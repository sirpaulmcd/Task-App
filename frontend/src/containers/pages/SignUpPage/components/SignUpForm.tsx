import axios from "axios";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

import { Button, TextField, Typography } from "@material-ui/core";

import { useAccessTokenContext } from "../../../../shared/contexts/AccessTokenContext";
import { useForm } from "../../../../shared/hooks/useForm";
import {
  VALIDATOR_ALPHA_WHITESPACE,
  VALIDATOR_ALPHANUMERIC,
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../shared/utils/FormValidator";
import useSignUpFormStyles from "./SignUpFormStyles";

interface SignUpFormProps {}

export const SignUpForm: React.FC<SignUpFormProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSignUpFormStyles();
  //#endregion

  //#region Routing -----------------------------------------------------------
  const history = useHistory();
  //#endregion

  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  //#endregion

  //#region Local ref ---------------------------------------------------------
  const emailRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  //#endregion

  //#region Register user mutation --------------------------------------------
  const registerUserMutation = async () => {
    const newUser = {
      name: formState.inputs.fullName.value,
      username: formState.inputs.username.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    await axios
      .post("http://localhost:8000/users", newUser)
      .then((res) => {
        auth.login(res.data.accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      fullName: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [
          VALIDATOR_REQUIRE(),
          VALIDATOR_ALPHA_WHITESPACE(),
          VALIDATOR_MAXLENGTH(50),
        ],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
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
      email: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
      password: {
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
    },
    false
  );

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formState.isValid) {
      try {
        await registerUserMutation();
        history.push("/");
      } catch (error) {
        invalidateForm(error);
      }
    }
  };

  const invalidateForm = (error: any) => {
    if (error.message.toLowerCase().includes("email")) {
      formDispatch({
        type: "INVALIDATE",
        errorMessage: "Email is already taken.",
        input: "email",
      });
    }
    if (error.message.toLowerCase().includes("username")) {
      formDispatch({
        type: "INVALIDATE",
        errorMessage: `Username ${formState.inputs.username.value} is not available.`,
        input: "username",
      });
    }
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <form
        className={classes.signUpForm_formContainer}
        noValidate
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <Typography className={classes.signUpForm_formLabel} variant="caption">
          Full Name *
        </Typography>
        <TextField
          id="fullName"
          variant="outlined"
          fullWidth
          value={formState.inputs.fullName.value}
          onChange={formInputHandler}
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
        <Typography className={classes.signUpForm_formLabel} variant="caption">
          Username *
        </Typography>
        <TextField
          id="username"
          className={classes.signUpForm_formItem}
          inputRef={usernameRef}
          variant="outlined"
          fullWidth
          value={formState.inputs.username.value}
          onChange={formInputHandler}
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
        <Typography className={classes.signUpForm_formLabel} variant="caption">
          Email *
        </Typography>
        <TextField
          id="email"
          className={classes.signUpForm_formItem}
          inputRef={emailRef}
          variant="outlined"
          fullWidth
          value={formState.inputs.email.value}
          onChange={formInputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.email.isUsed && !formState.inputs.email.isValid
          }
          helperText={
            formState.inputs.email.errorMessage && formState.inputs.email.isUsed
              ? formState.inputs.email.errorMessage
              : formState.inputs.email.helperText
          }
        />
        <Typography className={classes.signUpForm_formLabel} variant="caption">
          Password *
        </Typography>
        <TextField
          id="password"
          className={classes.signUpForm_formItem}
          type="password"
          variant="outlined"
          fullWidth
          value={formState.inputs.password.value}
          onChange={formInputHandler}
          onBlur={formBlurHandler}
          error={
            formState.inputs.password.isUsed &&
            !formState.inputs.password.isValid
          }
          helperText={
            formState.inputs.password.errorMessage &&
            formState.inputs.password.isUsed
              ? formState.inputs.password.errorMessage
              : formState.inputs.password.helperText
          }
        />
        <Button
          className={classes.signUpForm_submitButton}
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitHandler}
        >
          Submit
        </Button>
      </form>
    </>
  );
  //#endregion
};

export default SignUpForm;
