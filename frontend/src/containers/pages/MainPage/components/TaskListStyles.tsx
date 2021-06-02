import { makeStyles } from "@material-ui/core/styles";

const useTaskListStyles = makeStyles((theme) => ({
  taskList_unorderedList: {
    listStyle: "none",
    margin: "1rem auto",
    padding: "0",
  },
}));

export default useTaskListStyles;
