import React from "react";

import { Divider, Typography } from "@material-ui/core";

import { PublicProfileSection } from "./components/PublicProfileSection";

interface ProfileTabProps {}

export const ProfileTab: React.FC<ProfileTabProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography variant="h4">Profile Settings</Typography>
      <Divider />
      <PublicProfileSection />
      <Divider />
    </>
  );
  //#endregion
};
