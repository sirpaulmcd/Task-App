import React from "react";

import { Divider, Typography } from "@material-ui/core";

import { PasswordSection } from "./components/PasswordSection";
import { SessionSection } from "./components/SessionSection";

interface SecurityTabProps {}

export const SecurityTab: React.FC<SecurityTabProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography variant="h4">Security Settings</Typography>
      <Divider />
      <PasswordSection />
      <Divider />
      <SessionSection />
      <Divider />
    </>
  );
  //#endregion
};
