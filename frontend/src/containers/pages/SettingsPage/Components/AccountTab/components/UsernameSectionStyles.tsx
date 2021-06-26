import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useUsernameSectionStyles = makeStyles((theme) => ({
  usernameSection_formContainer: {
    display: "flex",
    flexDirection: "row",
  },
  usernameSection_leftContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  usernameSection_rightContainer: {
    display: "flex",
    flexGrow: 2,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  usernameSection_formItem: {
    marginTop: theme.spacing(0),
  },
  usernameSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  usernameSection_submitButton: {
    marginTop: theme.spacing(1),
    backgroundColor: green[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  usernameSection_title: {
    marginTop: theme.spacing(2),
  },
  usernameSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useUsernameSectionStyles;
