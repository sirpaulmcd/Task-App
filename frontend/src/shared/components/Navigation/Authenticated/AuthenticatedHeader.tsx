import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Select,
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

  //#region Routing -----------------------------------------------------------
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  const [user]: any = useUserContext();
  //#endregion

  //#region Logo button -------------------------------------------------------
  const handleLogoButtonPress = () => {
    setTaskList("");
  };

  const logoButtonContent = (
    <>
      <IconButton
        edge="start"
        className={classes.authenticatedHeader_menuButton}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawerHandler}
      >
        <MenuIcon />
      </IconButton>
      <Button
        className={classes.authenticatedHeader_logoButton}
        component={Link}
        to={"/"}
        variant="text"
        color="inherit"
        onClick={handleLogoButtonPress}
      >
        <AssignmentIcon className={classes.authenticatedHeader_taskIcon} />
        Task App
      </Button>
    </>
  );

  //#region List select -------------------------------------------------------
  const [taskList, setTaskList] = React.useState("");

  const handleTaskListSelectChange = (event: any) => {
    setTaskList(event.target.value);
    history.push(`/${event.target.value}`);
  };

  const listSelectContent = (
    <>
      <Select
        value={taskList}
        onChange={handleTaskListSelectChange}
        displayEmpty
        className={classes.authenticatedHeader_selectEmpty}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem value="">
          <em>All Lists</em>
        </MenuItem>
        {user && user.lists.length > 0
          ? user.lists.map((listName: string) => (
              <MenuItem key={listName} value={listName}>
                {listName}
              </MenuItem>
            ))
          : null}
        <MenuItem value="Finished">
          <em>Finished</em>
        </MenuItem>
      </Select>
    </>
  );
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

  const avatarMenuContent = (
    <>
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
    </>
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <div className={classes.authenticatedHeader_leftContainer}>
              {logoButtonContent}
              {location.pathname !== "/settings" ? listSelectContent : null}
            </div>
            <div className={classes.authenticatedHeader_rightContainer}>
              {avatarMenuContent}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
  //#endregion
};
