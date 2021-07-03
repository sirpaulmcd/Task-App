import React, { useState } from "react";

import { Button, ButtonGroup, Fade, Paper } from "@material-ui/core";

import { AccountTab } from "./Components/AccountTab/AccountTab";
import { AppearanceTab } from "./Components/AppearanceTab/AppearanceTab";
import { ProfileTab } from "./Components/ProfileTab/ProfileTab";
import { SecurityTab } from "./Components/SecurityTab/SecurityTab";
import useSettingsPageStyles from "./SettingsPageStyles";

interface SettingsPageProps {}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSettingsPageStyles();
  //#endregion

  //#region Tab navigation ----------------------------------------------------
  const [tabContent, setTabContent] = useState(<ProfileTab />);

  const tabClickHandler = (event: any) => {
    switch (
      event.target.children.length > 0
        ? event.target.children[0].innerHTML
        : event.target.innerHTML
    ) {
      case "profile":
        setTabContent(<ProfileTab />);
        break;
      case "account":
        setTabContent(<AccountTab />);
        break;
      case "appearance":
        setTabContent(<AppearanceTab />);
        break;
      case "security":
        setTabContent(<SecurityTab />);
        break;
      default:
        console.log("Error: Invalid tab selection.");
        break;
    }
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <div className={classes.settingsPage_gridContainer}>
        <Fade in={true}>
          <Paper className={classes.settingsPage_tabButtonPaper}>
            <ButtonGroup orientation="vertical" size="large" fullWidth>
              <Button disabled>Settings</Button>
              <Button onClick={tabClickHandler}>profile</Button>
              <Button onClick={tabClickHandler}>account</Button>
              <Button onClick={tabClickHandler}>appearance</Button>
              <Button onClick={tabClickHandler}>security</Button>
            </ButtonGroup>
          </Paper>
        </Fade>
        <Fade in={true}>
          <Paper className={classes.settingsPage_selectedTabPaper}>
            {tabContent}
          </Paper>
        </Fade>
      </div>
    </>
  );
  //#endregion
};
