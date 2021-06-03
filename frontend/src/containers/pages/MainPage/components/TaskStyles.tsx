import { makeStyles } from "@material-ui/core/styles";

const useTaskStyles = makeStyles((theme) => ({
  task_paper: {
    padding: "10px",
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
}));

export default useTaskStyles;
