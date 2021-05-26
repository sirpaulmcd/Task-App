import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useSessionSectionStyles = makeStyles((theme) => ({
  sessionSection_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  sessionSection_formItem: {
    marginTop: theme.spacing(0),
    width: "fit-content",
  },
  sessionSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  sessionSection_submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: green[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  sessionSection_title: {
    marginTop: theme.spacing(2),
  },
  sessionSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useSessionSectionStyles;
