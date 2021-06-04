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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import TaskForm from "./TaskForm";
import useTaskStyles from "./TaskStyles";

interface TaskProps {
  task: any;
  appendTaskToList: (task: any) => void;
  removeTaskFromList: (taskId: string) => void;
  updateTaskInList: (updatedTask: any) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  appendTaskToList,
  removeTaskFromList,
  updateTaskInList,
}) => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskStyles();
  //#endregion

  //#region Update task completion status mutation ----------------------------
  const toggleTaskCompletionMutation = async (taskId: string) => {
    await axios
      .patch(`http://localhost:8000/tasks/${taskId}`, {
        completed: !task.completed,
      })
      .then((res) => {
        if (res.status === 200) {
          updateTaskInList(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Delete task mutation ----------------------------------------------
  const deleteTaskMutation = async () => {
    await axios
      .delete(`http://localhost:8000/tasks/${task._id}`)
      .then(async (res) => {
        if (removeTaskFromList) {
          removeTaskFromList(res.data._id);
        }
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
              appendTaskToList={appendTaskToList}
              updateTaskInList={updateTaskInList}
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
      <li key={task._id}>
        <Paper className={classes.task_paper}>
          <Checkbox
            id={task._id}
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
          <IconButton
            aria-label="delete"
            onClick={async () => {
              await deleteTaskMutation();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      </li>
    </>
  );
  //#endregion
};

export default Task;
