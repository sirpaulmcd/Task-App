import { makeStyles } from "@material-ui/core/styles";

const useAuthenticatedHeaderStyles = makeStyles((theme) => ({
  //#region Preheader
  authenticatedHeader_menuButton: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  //#endregion
  //#region Left container
  authenticatedHeader_leftContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      justifyContent: "center",
    },
  },
  authenticatedHeader_logoButton: {
    [theme.breakpoints.down("xs")]: {
      fontSize: 0,
    },
  },
  authenticatedHeader_taskIcon: {
    marginRight: "5px", // theme.spacing(2);
  },
  authenticatedHeader_formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  authenticatedHeader_selectEmpty: {
    marginTop: theme.spacing(2),
  },
  //#endregion
  //#region Right container
  authenticatedHeader_rightContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  authenticatedHeader_avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.secondary.main,
  },
  //#endregion
}));

export default useAuthenticatedHeaderStyles;
