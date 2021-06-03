import axios from "axios";
import { useEffect, useState } from "react";

import { Backdrop, Fab, Fade, Modal, Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import useTaskPageStyles from "./TaskPageStyles";

interface TaskPageProps {}

const TaskPage: React.FC<TaskPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskPageStyles();
  //#endregion

  //#region Local state -------------------------------------------------------
  const [tasks, setTasks] = useState([]);
  //#endregion

  //#region Get user tasks query ----------------------------------------------
  const getUserTasks = async () => {
    await axios
      .get("http://localhost:8000/tasks")
      .then((res) => {
        if (res.data.length > 0) {
          setTasks(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Initialization ----------------------------------------------------
  useEffect(() => {
    getUserTasks();
  }, []);
  //#endregion

  //#region New task modal ----------------------------------------------------

  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  const handleNewTaskModalOpen = () => {
    setNewTaskModalOpen(true);
  };

  const handleNewTaskModalClose = () => {
    setNewTaskModalOpen(false);
  };

  const newTaskModalContent = (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.taskPage_modal}
        open={newTaskModalOpen}
        onClose={handleNewTaskModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={newTaskModalOpen}>
          <Paper className={classes.taskPage_modalPaper}>
            <TaskForm
              getUserTasks={getUserTasks}
              onClose={handleNewTaskModalClose}
            />
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {newTaskModalContent}
      <TaskList tasks={tasks} />
      <Fab color="primary" aria-label="add" onClick={handleNewTaskModalOpen}>
        <AddIcon />
      </Fab>
    </>
  );
  //#endregion
};

export default TaskPage;
