import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useDeleteAccountSectionStyles = makeStyles((theme) => ({
  deleteAccountSection_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  deleteAccountSection_formItem: {
    marginTop: theme.spacing(0),
    width: "fit-content",
  },
  deleteAccountSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  deleteAccountSection_submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: red[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  deleteAccountSection_title: {
    marginTop: theme.spacing(2),
  },
  deleteAccountSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useDeleteAccountSectionStyles;
