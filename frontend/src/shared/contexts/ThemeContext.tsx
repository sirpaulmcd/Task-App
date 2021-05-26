import React, { ReactNode, useContext, useEffect, useState } from "react";

import { ThemeProvider } from "@material-ui/core/styles";

import { darkTheme } from "../themes/darkTheme";
import { lightTheme } from "../themes/lightTheme";
import { useUserContext } from "./UserContext";

export enum UserThemes {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

//#region Theme context hook ==================================================

export const ThemeContext = React.createContext({});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

//#endregion

//#region Theme context provider ==============================================

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  //#region Context -----------------------------------------------------------
  const [user]: any = useUserContext();
  //#endregion

  //#region Theme initialization-----------------------------------------------
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(lightTheme);

  /**
   * If the user context object is changed, set theme according to stored user
   * preference.
   */
  useEffect(() => {
    if (user && user.theme) {
      switch (user.theme) {
        case UserThemes.LIGHT:
          setTheme(lightTheme);
          break;
        case UserThemes.DARK:
          setTheme(darkTheme);
          break;
        default:
          console.log("Error: Invalid user theme.");
          break;
      }
    }
    setLoading(false);
  }, [user, setLoading]);
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <ThemeContext.Provider value={loading}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
  //#endregion
};

//#endregion
