import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const usePublicProfileSectionStyles = makeStyles((theme) => ({
  publicProfileSection_formContainer: {
    display: "flex",
    flexDirection: "row",
  },
  publicProfileSection_leftContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  publicProfileSection_rightContainer: {
    display: "flex",
    flexGrow: 2,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  publicProfileSection_formItem: {
    marginTop: theme.spacing(0),
  },
  publicProfileSection_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  publicProfileSection_submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: green[500],
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  publicProfileSection_title: {
    marginTop: theme.spacing(2),
  },
  publicProfileSection_buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export default usePublicProfileSectionStyles;
