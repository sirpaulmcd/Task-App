import { makeStyles } from "@material-ui/core/styles";

const useTaskStyles = makeStyles((theme) => ({
  task_paper: {
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "row",
  },
  task_modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  task_modalPaper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  task_leftContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "75%",
  },
  task_rightContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "25%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
  },
  task_checkBoxContainer: {
    marginRight: "10px",
  },
  task_infoContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    wordWrap: "break-word",
  },
  task_titleText: {},
  task_dueDateTimeText: {},
  task_categoryText: {},
}));

export default useTaskStyles;
