import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const useAlertDialog = (
  message: string,
  confirmButtonText: string,
  cancelButtonText: string,
  onConfirm: any
) => {
  //#region Local state -------------------------------------------------------
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  //#endregion

  //#region Toggling ----------------------------------------------------------
  const handleAlertDialogOpen = () => {
    setAlertDialogOpen(true);
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
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
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertDialogClose} color="inherit">
            {cancelButtonText}
          </Button>
          <Button
            onClick={(e) => {
              onConfirm(e);
              handleAlertDialogClose();
            }}
            color="inherit"
            autoFocus
          >
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  //#endregion

  return [handleAlertDialogOpen, alertDialogContent];
};

export default useAlertDialog;
