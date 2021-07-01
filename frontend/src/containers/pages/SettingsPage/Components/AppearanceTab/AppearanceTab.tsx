import React from "react";

import { Divider, Typography } from "@material-ui/core";

import useSettingsPageStyles from "../../SettingsPageStyles";
import { ThemeSection } from "./components/ThemeSection";

interface AppearanceTabProps {}

export const AppearanceTab: React.FC<AppearanceTabProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSettingsPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.settingsPage_title} variant="h4">
        Appearance Settings
      </Typography>
      <Divider />
      <ThemeSection />
    </>
  );
  //#endregion
};
