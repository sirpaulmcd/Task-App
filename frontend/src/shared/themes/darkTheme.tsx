import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { blueGrey, grey } from "@material-ui/core/colors";

let darkTheme = createMuiTheme({
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

darkTheme = responsiveFontSizes(darkTheme);

export default darkTheme;
