import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useEmailSectionStyles = makeStyles((theme) => ({
  emailSection_formContainer: {
    display: "flex",
    flexDirection: "row",
  },
  emailSection_leftContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  emailSection_rightContainer: {
    display: "flex",
    flexGrow: 2,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  emailSection_formItem: {
    marginTop: theme.spacing(0),
  },
  emailSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  emailSection_submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: green[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  emailSection_title: {
    marginTop: theme.spacing(2),
  },
  emailSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useEmailSectionStyles;
