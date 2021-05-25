import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MenuIcon from "@material-ui/icons/Menu";

import { useAccessTokenContext } from "../../../contexts/AccessTokenContext";
import { useUserContext } from "../../../contexts/UserContext";
import useAuthenticatedHeaderStyles from "./AuthenticatedHeaderStyles";

interface AuthenticatedHeaderProps {
  toggleDrawerHandler: () => void;
}

export const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
  toggleDrawerHandler,
}) => {
  //#region Styles ------------------------------------------------------------
  const classes = useAuthenticatedHeaderStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  const [user]: any = useUserContext();
  //#endregion

  //#region Avatar menu -------------------------------------------------------
  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const clickAvatarMenuHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAvatarMenuAnchorEl(event.currentTarget);
  };

  const closeAvatarMenuHandler = () => {
    setAvatarMenuAnchorEl(null);
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.authenticatedHeader_menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawerHandler}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.authenticatedHeader_leftContainer}>
              <Button
                className={classes.authenticatedHeader_logoButton}
                component={Link}
                to={"/"}
                variant="text"
                color="inherit"
              >
                <AssignmentIcon
                  className={classes.authenticatedHeader_taskIcon}
                />
                Task App
              </Button>
            </div>
            <div className={classes.authenticatedHeader_rightContainer}>
              <IconButton
                id="avatarMenu"
                aria-haspopup="true"
                onClick={clickAvatarMenuHandler}
                color="inherit"
              >
                <Avatar className={classes.authenticatedHeader_avatar}>
                  {user?.name.split(" ")[0][0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="avatarMenu"
                anchorEl={avatarMenuAnchorEl}
                keepMounted
                open={Boolean(avatarMenuAnchorEl)}
                onClose={closeAvatarMenuHandler}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem component={Link} to={"/settings"}>
                  My Account
                </MenuItem>
                <MenuItem onClick={auth.logout}>Sign out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
  //#endregion
};
