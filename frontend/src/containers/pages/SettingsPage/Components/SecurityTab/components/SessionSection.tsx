import axios from "axios";
import React, { useState } from "react";

import { Button, Typography } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

import useAlertDialog from "../../../../../../shared/hooks/useAlertDialog";
import useSessionSectionStyles from "./SessionSectionStyles";

interface SessionSectionProps {}

export const SessionSection: React.FC<SessionSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSessionSectionStyles();
  //#endregion

  //#region Logout all sessions mutation --------------------------------------
  const logoutAllSessionsMutation = async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/logoutAll`)
      .then((res) => {
        setLogoutAllSessionsSuccess(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [logoutAllSessionsSuccess, setLogoutAllSessionsSuccess] =
    useState(false);

  const submitHandler = async (e: any) => {
    await logoutAllSessionsMutation();
    window.location.reload();
  };
  //#endregion

  //#region Alert dialog ------------------------------------------------------
  const [handleAlertDialogOpen, alertDialogContent]: any = useAlertDialog(
    "",
    "Are you sure you want to log out of all sessions? You will be asked to login again.",
    "No",
    "Yes",
    submitHandler
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {alertDialogContent}
      <Typography className={classes.sessionSection_title} variant="h5">
        Manage Sessions
      </Typography>
      <Typography variant="body1">
        If you believe your account has been compromised, you should log out of
        all sessions.
      </Typography>
      <div className={classes.sessionSection_buttonContainer}>
        <Button
          className={`${classes.sessionSection_submitButton} ${classes.sessionSection_formItem}`}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAlertDialogOpen}
        >
          Log out of all sessions
        </Button>
        {logoutAllSessionsSuccess ? <DoneIcon /> : null}
      </div>
    </>
  );
  //#endregion
};
