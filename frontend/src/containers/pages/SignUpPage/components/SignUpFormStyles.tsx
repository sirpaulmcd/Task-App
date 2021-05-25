import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useSignUpFormStyles = makeStyles((theme) => ({
  signUpForm_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  signUpForm_formItem: {
    marginTop: theme.spacing(0),
  },
  signUpForm_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  signUpForm_submitButton: {
    marginTop: theme.spacing(1),
    backgroundColor: green[500],
  },
}));

export default useSignUpFormStyles;
