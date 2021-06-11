import { makeStyles } from "@material-ui/core/styles";

const useTaskFormStyles = makeStyles((theme) => ({
  newTaskForm_formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  newTaskForm_formLabel: {
    fontWeight: "bold",
    marginLeft: "5px",
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  newTaskForm_title: {
    marginTop: "10px",
  },
  newTaskForm_submitButton: {
    marginTop: "20px",
    marginBottom: "10px",
  },
}));

export default useTaskFormStyles;
