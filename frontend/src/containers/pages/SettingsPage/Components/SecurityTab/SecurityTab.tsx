import React from "react";

import { Divider, Typography } from "@material-ui/core";

import useSettingsPageStyles from "../../SettingsPageStyles";
import { PasswordSection } from "./components/PasswordSection";
import { SessionSection } from "./components/SessionSection";

interface SecurityTabProps {}

export const SecurityTab: React.FC<SecurityTabProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSettingsPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.settingsPage_title} variant="h4">
        Security Settings
      </Typography>
      <Divider />
      <PasswordSection />
      <Divider />
      <SessionSection />
    </>
  );
  //#endregion
};
