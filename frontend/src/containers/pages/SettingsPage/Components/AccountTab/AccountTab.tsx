import React from "react";

import { Divider, Typography } from "@material-ui/core";

import { DeleteAccountSection } from "./components/DeleteAccountSection";
import { EmailSection } from "./components/EmailSection";
import { UsernameSection } from "./components/UsernameSection";

interface AccountTabProps {}

export const AccountTab: React.FC<AccountTabProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography variant="h4">Account Settings</Typography>
      <Divider />
      <EmailSection />
      <Divider />
      <UsernameSection />
      <Divider />
      <DeleteAccountSection />
    </>
  );
  //#endregion
};
