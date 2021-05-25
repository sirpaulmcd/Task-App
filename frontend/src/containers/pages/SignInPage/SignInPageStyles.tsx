import { makeStyles } from "@material-ui/core/styles";

const useSignInPageStyles = makeStyles((theme) => ({
  signInPage_headingContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signInPage_paper: {
    marginTop: theme.spacing(2),
    width: "100%",
    padding: "20px",
  },
}));

export default useSignInPageStyles;
