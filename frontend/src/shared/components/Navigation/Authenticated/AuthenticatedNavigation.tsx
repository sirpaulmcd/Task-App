import React, { useState } from "react";

import { AuthenticatedDrawer } from "./AuthenticatedDrawer";
import { AuthenticatedHeader } from "./AuthenticatedHeader";

interface AuthenticatedNavigationProps {}

const AuthenticatedNavigation: React.FC<AuthenticatedNavigationProps> = () => {
  //#region Drawer ------------------------------------------------------------
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawerHandler = (): void => {
    setDrawerOpen(!drawerOpen);
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <AuthenticatedDrawer
        toggleDrawerHandler={toggleDrawerHandler}
        open={drawerOpen}
      />
      <AuthenticatedHeader toggleDrawerHandler={toggleDrawerHandler} />
    </>
  );
  //#endregion
};

export default AuthenticatedNavigation;
