import { makeStyles } from "@material-ui/core/styles";

const useLoadingPageStyles = makeStyles((theme) => ({
  loadingPage_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  loadingPage_loadingText: {
    marginTop: "125px",
  },
}));

export default useLoadingPageStyles;
