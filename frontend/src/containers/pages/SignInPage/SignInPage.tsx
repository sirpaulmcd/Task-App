import { Link as RouterLink } from "react-router-dom";

import { Container, Link, Paper, Typography } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";

import SignInForm from "./components/SignInForm";
import useSignInPageStyles from "./SignInPageStyles";

interface SignInPageProps {}

const SignInPage: React.FC<SignInPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSignInPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.signInPage_headingContainer}
      >
        <AssignmentIcon fontSize="large" />
        <Typography variant="h4" align="center">
          Sign in to Task App
        </Typography>
        <Paper className={classes.signInPage_paper}>
          <SignInForm />
        </Paper>
        <Paper className={classes.signInPage_paper}>
          <Typography align="center">
            New to Task App?{" "}
            <Link component={RouterLink} to="/signup">
              Create an account
            </Link>
            .
          </Typography>
        </Paper>
        <br />
      </Container>
    </>
  );
  //#endregion
};

export default SignInPage;
