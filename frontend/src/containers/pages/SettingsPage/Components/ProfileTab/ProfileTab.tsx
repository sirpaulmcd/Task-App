import React from "react";

import { Divider, Typography } from "@material-ui/core";

import useSettingsPageStyles from "../../SettingsPageStyles";
import { PublicProfileSection } from "./components/PublicProfileSection";

interface ProfileTabProps {}

export const ProfileTab: React.FC<ProfileTabProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useSettingsPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.settingsPage_title} variant="h4">
        Profile Settings
      </Typography>
      <Divider />
      <PublicProfileSection />
    </>
  );
  //#endregion
};
