import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";

let lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: indigo[900],
    },
  },
});

lightTheme = responsiveFontSizes(lightTheme);

export default lightTheme;
