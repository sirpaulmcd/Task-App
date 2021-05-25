import React, { useState } from "react";

import UnauthenticatedDrawer from "./UnauthenticatedDrawer";
import UnauthenticatedHeader from "./UnauthenticatedHeader";

interface UnauthenticatedNavigationProps {}

const UnauthenticatedNavigation: React.FC<UnauthenticatedNavigationProps> =
  () => {
    //#region Drawer ----------------------------------------------------------
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawerHandler = () => {
      setDrawerOpen(!drawerOpen);
    };
    //#endregion

    //#region TSX -------------------------------------------------------------
    return (
      <>
        <UnauthenticatedDrawer
          toggleDrawerHandler={toggleDrawerHandler}
          open={drawerOpen}
        />
        <UnauthenticatedHeader toggleDrawerHandler={toggleDrawerHandler} />
      </>
    );
    //#endregion
  };

export default UnauthenticatedNavigation;
