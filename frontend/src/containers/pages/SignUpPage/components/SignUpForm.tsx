import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
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

  //#region Register user mutation --------------------------------------------
  const registerUserMutation = async () => {
    const newUser = {
      name: formState.inputs.fullName.value,
      username: formState.inputs.username.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users`, newUser)
      .then((res) => {
        auth.login(res.data.accessToken);
        history.push("/");
      })
      .catch((error) => {
        invalidateForm(error);
      });
  };

  /**
   * If user somehow bypasses frontend unique email/username checking, display
   * error message from backend rejection.
   */
  const invalidateForm = (error: any) => {
    if (error.response.data.error.toLowerCase().includes("email")) {
      invalidateEmailFormField();
    }
    if (error.response.data.error.toLowerCase().includes("username")) {
      invalidateUsernameFormField();
    }
  };
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [
    formState,
    formDispatch,
    formInputHandler,
    formBlurHandler,
    formSubmitHandler,
  ] = useForm(
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
    formSubmitHandler(e);
    if (formState.isValid) {
      await registerUserMutation();
    }
  };

  const invalidateUsernameFormField = useCallback(() => {
    formDispatch({
      type: "INVALIDATE",
      errorMessage: `Username is already taken.`,
      input: "username",
    });
  }, [formDispatch]);

  const invalidateEmailFormField = useCallback(() => {
    formDispatch({
      type: "INVALIDATE",
      errorMessage: "Email is already taken.",
      input: "email",
    });
  }, [formDispatch]);
  //#endregion

  //#region Unique email query ------------------------------------------------
  const checkUniqueEmailQuery = useCallback(async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/unique`, {
        email: formState.inputs.email.value,
      })
      .catch((error) => {
        invalidateEmailFormField();
      });
  }, [formState.inputs.email.value, invalidateEmailFormField]);

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
      if (email === emailRef.current?.value) {
        checkUniqueEmailQuery();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [formState.inputs.email.value, checkUniqueEmailQuery]);
  //#endregion

  //#region Unique username query ---------------------------------------------
  const checkUniqueUsernameQuery = useCallback(async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/unique`, {
        username: formState.inputs.username.value,
      })
      .catch((error) => {
        invalidateUsernameFormField();
      });
  }, [formState.inputs.username.value, invalidateUsernameFormField]);

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
      if (username === usernameRef.current?.value) {
        checkUniqueUsernameQuery();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [formState.inputs.username.value, checkUniqueUsernameQuery]);
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
          type="submit"
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
