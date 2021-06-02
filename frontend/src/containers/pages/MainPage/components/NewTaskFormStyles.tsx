import { makeStyles } from "@material-ui/core/styles";

const useNewTaskFormStyles = makeStyles((theme) => ({
  newTaskForm_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
}));

export default useNewTaskFormStyles;
