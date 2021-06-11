import { makeStyles } from "@material-ui/core/styles";

const useSettingsPageStyles = makeStyles((theme) => ({
  settingsPage_gridContainer: {
    marginTop: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridGap: "20px",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  settingsPage_tabButtonPaper: {
    height: "fit-content",
  },
  settingsPage_selectedTabPaper: {
    padding: "15px",
    marginBottom: "10px",
  },
}));

export default useSettingsPageStyles;
