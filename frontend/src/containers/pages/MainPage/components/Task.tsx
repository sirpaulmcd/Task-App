import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router";

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
  getUserTasks: () => Promise<void>;
}

const Task: React.FC<TaskProps> = ({ task, getUserTasks }) => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskStyles();
  //#endregion

  //#region Routing -----------------------------------------------------------
  const params: any = useParams();
  //#endregion

  //#region Update task completion status mutation ----------------------------
  const toggleTaskCompletionMutation = async (taskId: string) => {
    await axios
      .patch(`${process.env.REACT_APP_BACKEND_URI}/tasks/${taskId}`, {
        completed: !task.completed,
      })
      .then(async (res) => {
        if (res.status === 200 && getUserTasks) {
          await getUserTasks();
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
      .delete(`${process.env.REACT_APP_BACKEND_URI}/tasks/${task._id}`)
      .then(async (res) => {
        if (res.status === 200 && getUserTasks) {
          await getUserTasks();
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
              getUserTasks={getUserTasks}
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

  //#region Task content ------------------------------------------------------
  let dateFieldContent = null;
  if (task.dueDateTime) {
    dateFieldContent = (
      <>
        <Typography className={classes.task_dueDateTimeText} variant="body2">
          {new Date(task.dueDateTime).toLocaleTimeString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </>
    );
  }

  let categoryFieldContent = null;
  if (
    !params.taskList ||
    (params.taskList && task.category !== params.taskList)
  ) {
    categoryFieldContent = (
      <>
        <Typography className={classes.task_categoryText} variant="body2">
          {task.category}
        </Typography>
      </>
    );
  }
  const taskContent = (
    <>
      <li key={task._id}>
        <Paper className={classes.task_paper}>
          <div className={classes.task_leftContainer}>
            <div className={classes.task_checkBoxContainer}>
              <Checkbox
                id={task._id}
                checked={task.completed}
                onChange={handleCheckBoxChange}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className={classes.task_infoContainer}>
              <Typography className={classes.task_titleText} variant="h6">
                {task.title}
              </Typography>
              {dateFieldContent}
              {categoryFieldContent}
            </div>
          </div>
          <div className={classes.task_rightContainer}>
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
          </div>
        </Paper>
      </li>
    </>
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {updateTaskModalContent}
      {taskContent}
    </>
  );
  //#endregion
};

export default Task;
