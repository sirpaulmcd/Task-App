import React from "react";
import ReactDOM from "react-dom";
import { Link, useLocation } from "react-router-dom";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import { useAccessTokenContext } from "../../../contexts/AccessTokenContext";
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

  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  //#endregion

  //#region Routing -----------------------------------------------------------
  const location = useLocation();
  //#endregion

  //#region Tasks button ------------------------------------------------------
  let tasksButtonContent = null;
  if (location.pathname === "/settings") {
    tasksButtonContent = (
      <>
        <ListItem
          button
          component={Link}
          to={"/"}
          onClick={toggleDrawerHandler}
        >
          <ListItemText primary="Tasks" />
        </ListItem>
      </>
    );
  }
  //#endregion

  //#region Settings button ---------------------------------------------------
  let settingsButtonContent = null;
  if (location.pathname !== "/settings") {
    settingsButtonContent = (
      <>
        <ListItem
          button
          component={Link}
          to={"/settings"}
          onClick={toggleDrawerHandler}
        >
          <ListItemText primary="Settings" />
        </ListItem>
      </>
    );
  }
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return ReactDOM.createPortal(
    <>
      <Drawer anchor="right" open={open} onClose={toggleDrawerHandler}>
        <List className={classes.authenticatedDrawer_list}>
          {tasksButtonContent}
          {settingsButtonContent}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={auth.logout}>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Drawer>
    </>,
    document.getElementById("drawer")!
    //#endregion
  );
};
