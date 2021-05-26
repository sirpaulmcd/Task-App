import { createMuiTheme } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: indigo[900],
    },
  },
});
