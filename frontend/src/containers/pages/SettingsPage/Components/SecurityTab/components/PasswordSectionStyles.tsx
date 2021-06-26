import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const usePasswordSectionStyles = makeStyles((theme) => ({
  passwordSection_formContainer: {
    display: "flex",
    flexDirection: "row",
  },
  passwordSection_leftContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  passwordSection_rightContainer: {
    display: "flex",
    flexGrow: 2,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  passwordSection_formItem: {
    marginTop: theme.spacing(0),
  },
  passwordSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  passwordSection_submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: green[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  passwordSection_title: {
    marginTop: theme.spacing(2),
  },
  passwordSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default usePasswordSectionStyles;
