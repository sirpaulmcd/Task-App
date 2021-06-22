import axios from "axios";
import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";

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
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const handleAlertDialogOpen = () => {
    setAlertDialogOpen(true);
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const alertDialogContent = (
    <div>
      <Dialog
        open={alertDialogOpen}
        onClose={handleAlertDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once an account is deleted, it cannot be recovered. You will have to
            make a new account to continue using this service.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertDialogClose} color="inherit">
            No
          </Button>
          <Button
            onClick={(e) => {
              submitHandler(e);
              handleAlertDialogClose();
            }}
            color="inherit"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
