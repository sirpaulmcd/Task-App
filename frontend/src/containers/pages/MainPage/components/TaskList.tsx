import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Backdrop,
  Container,
  Fab,
  Fade,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Task from "./Task";
import TaskForm from "./TaskForm";
import useTaskListStyles from "./TaskListStyles";

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskListStyles();
  //#endregion

  //#region Local state -------------------------------------------------------
  const [tasks, setTasks] = useState<{}[]>([]);
  //#endregion

  //#region Get user tasks query ----------------------------------------------
  const getUserTasks = async () => {
    await axios
      .get("http://localhost:8000/tasks")
      .then((res) => {
        if (res.status === 200 && res.data.length > 0) {
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

  //#region Task list management ----------------------------------------------
  const appendTaskToList = (task: any) => {
    setTasks([...tasks, task]);
  };

  const updateTaskInList = (updatedTask: any) => {
    const newTasks = tasks.filter((task: any) => task._id !== updatedTask._id);
    newTasks.push(updatedTask);
    setTasks(newTasks);
  };

  const removeTaskFromList = (taskId: string) => {
    setTasks(tasks.filter((task: any) => task._id !== taskId));
  };
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
        className={classes.taskList_modal}
        open={newTaskModalOpen}
        onClose={handleNewTaskModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={newTaskModalOpen}>
          <Paper className={classes.taskList_modalPaper}>
            <TaskForm
              appendTaskToList={appendTaskToList}
              onClose={handleNewTaskModalClose}
            />
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
  //#endregion

  //#region Task content ------------------------------------------------------
  const tasksContent = (
    <>
      <Container maxWidth="sm">
        <ul className={classes.taskList_unorderedList}>
          {tasks.map((task: any) => (
            <Task
              key={task._id}
              task={task}
              appendTaskToList={appendTaskToList}
              removeTaskFromList={removeTaskFromList}
              updateTaskInList={updateTaskInList}
            />
          ))}
        </ul>
      </Container>
    </>
  );

  const noTasksContent = (
    <>
      <Typography>No tasks.</Typography>
    </>
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {newTaskModalContent}
      {tasks.length === 0 ? noTasksContent : tasksContent}
      <Fab color="primary" aria-label="add" onClick={handleNewTaskModalOpen}>
        <AddIcon />
      </Fab>
    </>
  );
  //#endregion
};

export default TaskList;
