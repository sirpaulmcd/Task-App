import { makeStyles } from "@material-ui/core/styles";

const useTaskPageStyles = makeStyles((theme) => ({
  taskPage_modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  taskPage_modalPaper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default useTaskPageStyles;
