import React from "react";
import ReactDOM from "react-dom";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import useAuthenticatedDrawerStyles from "./AuthenticatedDrawerStyles";

interface AuthenticatedDrawerProps {
  toggleDrawerHandler: () => void;
  open: boolean;
}

export const AuthenticatedDrawer: React.FC<AuthenticatedDrawerProps> = ({
  toggleDrawerHandler,
  open,
}) => {
  //#region Styles ------------------------------------------------------------
  const classes = useAuthenticatedDrawerStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return ReactDOM.createPortal(
    <>
      <Drawer anchor="left" open={open} onClose={toggleDrawerHandler}>
        <List className={classes.authenticatedDrawer_list}>
          <ListItem button onClick={toggleDrawerHandler}>
            <ListItemText primary="Header buttons" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={toggleDrawerHandler}>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Drawer>
    </>,
    document.getElementById("drawer")!
    //#endregion
  );
};
