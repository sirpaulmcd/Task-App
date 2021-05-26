import React from "react";

import { Divider, Typography } from "@material-ui/core";

import { ThemeSection } from "./components/ThemeSection";

interface AppearanceTabProps {}

export const AppearanceTab: React.FC<AppearanceTabProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography variant="h4">Appearance Settings</Typography>
      <Divider />
      <ThemeSection />
      <Divider />
    </>
  );
  //#endregion
};
