import { createMuiTheme } from "@material-ui/core";
import { blueGrey, grey } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blueGrey[500],
    },
  },
});
