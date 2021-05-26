import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useEmailSectionStyles = makeStyles((theme) => ({
  emailSection_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  emailSection_formItem: {
    marginTop: theme.spacing(0),
    width: "fit-content",
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
