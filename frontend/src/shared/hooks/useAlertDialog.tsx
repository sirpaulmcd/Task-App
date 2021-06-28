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
  title: string,
  description: string,
  cancelButtonText: string,
  confirmButtonText: string,
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

  //#region Title content -----------------------------------------------------
  let titleContent = null;
  if (title) {
    titleContent = (
      <>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      </>
    );
  }
  //#endregion

  //#region Description content -----------------------------------------------
  let descriptionContent = null;
  if (description) {
    descriptionContent = (
      <>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      </>
    );
  }
  //#endregion

  //#region Cancel button content ---------------------------------------------
  let cancelButtonContent = null;
  if (cancelButtonText) {
    cancelButtonContent = (
      <>
        <Button onClick={handleAlertDialogClose} color="inherit">
          {cancelButtonText}
        </Button>
      </>
    );
  }
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
        {titleContent}
        {descriptionContent}
        <DialogActions>
          {cancelButtonContent}
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
