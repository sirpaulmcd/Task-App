import axios from "axios";
import { useHistory } from "react-router-dom";

import { Button, TextField, Typography } from "@material-ui/core";

import { useAccessTokenContext } from "../../../../shared/contexts/AccessTokenContext";
import { useForm } from "../../../../shared/hooks/useForm";
import { VALIDATOR_REQUIRE } from "../../../../shared/utils/FormValidator";
import useSignInFormStyles from "./SignInFormStyles";

interface SignInFormProps {}

const SignInForm: React.FC<SignInFormProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSignInFormStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  //#endregion

  //#region Routing -----------------------------------------------------------
  const history = useHistory();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [formState, formDispatch, formInputHandler, formBlurHandler] = useForm(
    {
      email: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
      password: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
    },
    false
  );

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formState.isValid) {
      try {
        await loginUserMutation();
        history.push("/");
      } catch (error) {
        formDispatch({
          type: "INVALIDATE",
          errorMessage: "Email and password combination is invalid.",
          input: "email",
        });
        formDispatch({
          type: "INVALIDATE",
          errorMessage: "",
          input: "password",
        });
      }
    }
  };
  //#endregion

  //#region Login mutation ----------------------------------------------------
  const loginUserMutation = async () => {
    const loginUserObject = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/login`, loginUserObject)
      .then((res) => {
        auth.login(res.data.accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <form
        className={classes.signInForm_formContainer}
        noValidate
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <Typography className={classes.signInForm_formLabel} variant="caption">
          Email
        </Typography>
        <TextField
          id="email"
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
        <Typography className={classes.signInForm_formLabel} variant="caption">
          Password
        </Typography>
        <TextField
          id="password"
          className={classes.signInForm_formItem}
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
          className={`${classes.signInForm_formItem} ${classes.signInForm_submitButton}`}
          fullWidth
          variant="contained"
          color="primary"
          onClick={submitHandler}
        >
          Submit
        </Button>
      </form>
    </>
  );
  //#endregion
};

export default SignInForm;
