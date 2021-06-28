import axios from "axios";
import React from "react";

import { Button, Typography } from "@material-ui/core";

import useAlertDialog from "../../../../../../shared/hooks/useAlertDialog";
import useDeleteAccountSectionStyles from "./DeleteAccountSectionStyles";

interface SessionSectionProps {}

export const DeleteAccountSection: React.FC<SessionSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useDeleteAccountSectionStyles();
  //#endregion

  //#region Delete account mutation -------------------------------------------
  const deleteAccountMutation = async () => {
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URI}/users/me`)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Basic form management ---------------------------------------------
  const submitHandler = async (e: any) => {
    await deleteAccountMutation();
  };
  //#endregion

  //#region Alert dialog ------------------------------------------------------
  const [handleAlertDialogOpen, alertDialogContent]: any = useAlertDialog(
    "Once an account is deleted, it cannot be recovered. You will have to make a new account to continue using this service.",
    "Yes",
    "No",
    submitHandler
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {alertDialogContent}
      <Typography className={classes.deleteAccountSection_title} variant="h5">
        Account Deletion
      </Typography>
      <div className={classes.deleteAccountSection_buttonContainer}>
        <Button
          className={`${classes.deleteAccountSection_submitButton} ${classes.deleteAccountSection_formItem}`}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAlertDialogOpen}
        >
          Delete Account
        </Button>
      </div>
    </>
  );
  //#endregion
};
