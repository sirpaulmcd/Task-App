import { makeStyles } from "@material-ui/core/styles";

const useSettingsPageStyles = makeStyles((theme) => ({
  settingsPage_gridContainer: {
    marginTop: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridGap: "20px",
  },
  settingsPage_tabButtonPaper: {
    height: "fit-content",
  },
  settingsPage_selectedTabPaper: {
    padding: "15px",
  },
}));

export default useSettingsPageStyles;
