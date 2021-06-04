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
}));

export default useTaskListStyles;
