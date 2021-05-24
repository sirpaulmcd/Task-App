import { makeStyles } from "@material-ui/core/styles";

const useUnauthenticatedHeaderStyles = makeStyles((theme) => ({
  //#region Left container
  unauthenticatedHeader_leftContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  unauthenticatedHeader_taskIcon: {
    marginRight: "5px", // theme.spacing(2);
  },
  unauthenticatedHeader_logoButton: {
    [theme.breakpoints.down("xs")]: {
      // fontSize: 0,
    },
  },
  //#endregion
  //#region Right container
  unauthenticatedHeader_rightContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      width: "auto",
      justifyContent: "flex-end",
    },
  },
  unauthenticatedHeader_signInButton: {
    marginRight: "15px",
  },
  unauthenticatedHeader_button: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  unauthenticatedHeader_menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  //#endregion
}));

export default useUnauthenticatedHeaderStyles;
