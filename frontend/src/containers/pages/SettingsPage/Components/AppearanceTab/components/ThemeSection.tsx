import axios from "axios";
import React from "react";

import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";

import { UserThemes } from "../../../../../../shared/contexts/ThemeContext";
import { useUserContext } from "../../../../../../shared/contexts/UserContext";
import useThemeSectionStyles from "./ThemeSectionStyles";

interface ThemeSectionProps {}

export const ThemeSection: React.FC<ThemeSectionProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useThemeSectionStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const [user, setUser]: any = useUserContext();
  //#endregion

  //#region Basic form management ---------------------------------------------
  const radioSelectionHandler = async (event: any) => {
    await updateUserMutation(event);
  };
  //#endregion

  //#region Update user mutation ----------------------------------------------
  const updateUserMutation = async (event: any) => {
    await axios
      .patch(`${process.env.REACT_APP_BACKEND_URI}/users/me`, {
        theme: event.target.value,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography className={classes.themeSection_title} variant="h5">
        Change theme
      </Typography>
      <RadioGroup
        aria-label="theme"
        name="themes"
        value={user.theme || UserThemes.LIGHT}
        onChange={radioSelectionHandler}
      >
        <FormControlLabel
          value={UserThemes.LIGHT}
          control={<Radio />}
          label="Light"
        />
        <FormControlLabel
          className={classes.themeSection_bottomLabel}
          value={UserThemes.DARK}
          control={<Radio />}
          label="Dark"
        />
      </RadioGroup>
    </>
  );
  //#endregion
};
