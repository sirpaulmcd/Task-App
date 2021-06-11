import { makeStyles } from "@material-ui/core/styles";

const useTaskListStyles = makeStyles((theme) => ({
  taskList_unorderedList: {
    listStyle: "none",
    margin: "1rem auto",
    padding: "0",
  },
  taskList_modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  taskList_modalPaper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  taskList_fabContainer: {
    position: "fixed",
    right: "75px",
    bottom: "75px",
    [theme.breakpoints.up("sm")]: {
      display: "None",
    },
  },
  taskList_floatingActionButton: {
    position: "absolute",
  },
  taskList_taskContainer: {
    marginBottom: "50px",
  },
  taskList_newTaskButton: {
    marginTop: "15px",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  taskList_noTasksContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  taskList_noTasksText: {
    marginTop: "125px",
  },
}));

export default useTaskListStyles;
