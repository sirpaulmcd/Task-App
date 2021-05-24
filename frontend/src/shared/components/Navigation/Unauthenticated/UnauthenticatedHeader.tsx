import React from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MenuIcon from "@material-ui/icons/Menu";

import useUnauthenticatedHeaderStyles from "./UnauthenticatedHeaderStyles";

interface UnauthenticatedHeaderProps {
  toggleDrawerHandler: () => void;
}

const UnauthenticatedHeader: React.FC<UnauthenticatedHeaderProps> = ({
  toggleDrawerHandler,
}) => {
  //#region Styles
  const classes = useUnauthenticatedHeaderStyles();
  //#endregion

  //#region TSX
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <div className={classes.unauthenticatedHeader_leftContainer}>
              <Button
                className={classes.unauthenticatedHeader_logoButton}
                component={Link}
                to={"/"}
                variant="text"
                color="inherit"
              >
                <AssignmentIcon
                  className={classes.unauthenticatedHeader_taskIcon}
                />
                Task App
              </Button>
            </div>
            <div className={classes.unauthenticatedHeader_rightContainer}>
              <Button
                className={`${classes.unauthenticatedHeader_signInButton} ${classes.unauthenticatedHeader_button}`}
                component={Link}
                to={"/signin"}
                variant="text"
                color="inherit"
              >
                Sign In
              </Button>
              <Button
                className={`${classes.unauthenticatedHeader_button}`}
                component={Link}
                to={"/signup"}
                variant="contained"
                color="secondary"
              >
                Sign Up
              </Button>
              <IconButton
                edge="start"
                className={classes.unauthenticatedHeader_menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawerHandler}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
  //#endregion
};

export default UnauthenticatedHeader;
