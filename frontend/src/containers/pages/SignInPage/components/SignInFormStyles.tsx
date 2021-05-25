import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useSignInFormStyles = makeStyles((theme) => ({
  signInForm_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  signInForm_formItem: {
    marginTop: theme.spacing(0),
  },
  signInForm_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  signInForm_submitButton: {
    marginTop: theme.spacing(2.5),
    backgroundColor: green[500],
  },
}));

export default useSignInFormStyles;
