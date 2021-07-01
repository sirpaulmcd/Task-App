import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Container, Link, Paper, Typography } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";

import SignUpForm from "./components/SignUpForm";
import useSignUpPageStyles from "./SignUpPageStyles";

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSignUpPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.signUpPage_headingContainer}
      >
        <AssignmentIcon fontSize="large" />
        <Typography variant="h4" align="center">
          Sign up for Task App
        </Typography>
        <Paper className={classes.signUpPage_paper}>
          <SignUpForm />
        </Paper>
        <Paper
          className={`${classes.signUpPage_paper} ${classes.signUpPage_lastItem}`}
        >
          <Typography align="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/signin">
              Sign in
            </Link>
            .
          </Typography>
        </Paper>
      </Container>
    </>
  );
  //#endregion
};

export default SignUpPage;
