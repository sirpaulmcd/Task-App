import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

import useUnauthenticatedDrawerStyles from "./UnauthenticatedDrawerStyles";

interface UnauthenticatedDrawerProps {
  toggleDrawerHandler: () => void;
  open: boolean;
}

const UnauthenticatedDrawer: React.FC<UnauthenticatedDrawerProps> = ({
  toggleDrawerHandler,
  open,
}) => {
  //#region Styles
  const classes = useUnauthenticatedDrawerStyles();
  //#endregion

  //#region TSX
  return ReactDOM.createPortal(
    <>
      <Drawer anchor="right" open={open} onClose={toggleDrawerHandler}>
        <List className={classes.unauthenticatedDrawer_list}>
          <ListItem
            button
            component={Link}
            to={"/signin"}
            onClick={toggleDrawerHandler}
          >
            <ListItemText primary="Sign in" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to={"/signup"}
            onClick={toggleDrawerHandler}
          >
            <ListItemText primary="Sign up" />
          </ListItem>
        </List>
      </Drawer>
    </>,
    document.getElementById("drawer")!
  );
  //#endregion
};

export default UnauthenticatedDrawer;
