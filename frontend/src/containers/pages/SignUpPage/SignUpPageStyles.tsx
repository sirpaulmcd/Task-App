import { makeStyles } from "@material-ui/core/styles";

const useSignUpPageStyles = makeStyles((theme) => ({
  signUpPage_headingContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signUpPage_paper: {
    marginTop: theme.spacing(2),
    width: "100%",
    padding: "20px",
  },
  signUpPage_lastItem: {
    marginBottom: "25px",
  },
}));

export default useSignUpPageStyles;
