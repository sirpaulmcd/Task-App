import { makeStyles } from "@material-ui/core/styles";

const useAuthenticatedHeaderStyles = makeStyles((theme) => ({
  //#region Left container
  authenticatedHeader_leftContainer: {
    width: "100%",
    height: "64px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  authenticatedHeader_logoButton: {
    [theme.breakpoints.down("xs")]: {
      fontSize: 0,
    },
  },
  authenticatedHeader_taskIcon: {
    marginRight: "5px",
    [theme.breakpoints.down("xs")]: {
      marginRight: "0px",
    },
  },
  authenticatedHeader_selectEmpty: {
    height: "60%",
    marginLeft: theme.spacing(2),
    color: "white",
  },
  //#endregion
  //#region Right container
  authenticatedHeader_rightContainer: {
    height: "64px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  authenticatedHeader_avatarButton: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  authenticatedHeader_avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.secondary.main,
  },
  authenticatedHeader_menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  //#endregion
}));

export default useAuthenticatedHeaderStyles;
