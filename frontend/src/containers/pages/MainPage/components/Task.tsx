import axios from "axios";
import React, { useState } from "react";

import {
  Backdrop,
  Checkbox,
  Fade,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import TaskForm from "./TaskForm";
import useTaskStyles from "./TaskStyles";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  dueDateTime: string;
  category: string;
  completed: boolean;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  description,
  dueDateTime,
  category,
  completed,
}) => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskStyles();
  //#endregion

  //#region Local state -------------------------------------------------------
  const [task, setTask] = useState({
    id,
    title,
    description,
    dueDateTime,
    category,
    completed,
  });
  //#endregion

  //#region Update task completion status mutation ----------------------------
  const toggleTaskCompletionMutation = async (taskId: string) => {
    await axios
      .patch(`http://localhost:8000/tasks/${taskId}`, {
        completed: !task.completed,
      })
      .then((res) => {
        setTask({
          ...task,
          completed: res.data.completed,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Update task modal ----------------------------------------------------

  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);

  const handleUpdateTaskModalOpen = () => {
    setUpdateTaskModalOpen(true);
  };

  const handleUpdateTaskModalClose = () => {
    setUpdateTaskModalOpen(false);
  };

  const updateTaskModalContent = (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.task_modal}
        open={updateTaskModalOpen}
        onClose={handleUpdateTaskModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={updateTaskModalOpen}>
          <Paper className={classes.task_modalPaper}>
            <TaskForm
              task={task}
              setTask={setTask}
              onClose={handleUpdateTaskModalClose}
            />
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
  //#endregion

  //#region Check box ---------------------------------------------------------
  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleTaskCompletionMutation(event.target.id);
  };
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {updateTaskModalContent}
      <li>
        <Paper className={classes.task_paper}>
          <Checkbox
            id={task.id}
            checked={task.completed}
            onChange={handleCheckBoxChange}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
          <Typography>Title: {task.title}</Typography>
          <Typography>Description: {task.description}</Typography>
          <Typography>Due: {task.dueDateTime}</Typography>
          <Typography>Category: {task.category}</Typography>
          <IconButton aria-label="delete" onClick={handleUpdateTaskModalOpen}>
            <EditIcon />
          </IconButton>
        </Paper>
      </li>
    </>
  );
  //#endregion
};

export default Task;
