import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import {
  Backdrop,
  Button,
  Container,
  Fab,
  Fade,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

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

  //#region Routing -----------------------------------------------------------
  const params: any = useParams();
  //#endregion

  //#region Get user tasks query ----------------------------------------------
  let taskUrl = `${process.env.REACT_APP_BACKEND_URI}/tasks?sortBy=dueDateTime:asc`;
  if (params.taskList) {
    if (params.taskList === "Finished") {
      taskUrl += "&completed=true";
    } else {
      taskUrl += `&category=${params.taskList}`;
    }
  }

  const getUserTasks = useCallback(async () => {
    await axios
      .get(taskUrl)
      .then((res) => {
        if (res.status === 200) {
          setTasks(
            res.data.sort((a: any, b: any) => {
              if (a.dueDateTime !== null) {
                return -1;
              } else {
                return 1;
              }
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [taskUrl]);
  //#endregion

  //#region Initialization ----------------------------------------------------
  useEffect(() => {
    setTasks([]);
    getUserTasks();
  }, [params.taskList, setTasks, getUserTasks]);
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
              getUserTasks={getUserTasks}
              onClose={handleNewTaskModalClose}
            />
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
  //#endregion

  //#region Task content ------------------------------------------------------
  const taskShouldRender = (task: any): boolean => {
    return (
      !task.completed || (task.completed && params.taskList === "Finished")
    );
  };

  const tasksContent = (
    <>
      <Container className={classes.taskList_taskContainer} maxWidth="sm">
        <Button
          className={classes.taskList_newTaskButton}
          variant="outlined"
          fullWidth
          onClick={handleNewTaskModalOpen}
        >
          Create new task
        </Button>
        <ul className={classes.taskList_unorderedList}>
          {tasks.map((task: any) => {
            if (taskShouldRender(task)) {
              return (
                <Task key={task._id} task={task} getUserTasks={getUserTasks} />
              );
            }
            return null;
          })}
        </ul>
      </Container>
    </>
  );

  const noTasksContent = (
    <>
      <Container className={classes.taskList_noTasksContainer} maxWidth="sm">
        <Typography
          className={classes.taskList_noTasksText}
          align="center"
          variant="h3"
        >
          <AssignmentTurnedInIcon fontSize="inherit" />
          <br />
          No Tasks
        </Typography>
        <Button
          className={classes.taskList_newTaskButton}
          variant="outlined"
          size="large"
          onClick={handleNewTaskModalOpen}
        >
          Create new task
        </Button>
      </Container>
    </>
  );
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      {newTaskModalContent}
      {tasks.length === 0 ? noTasksContent : tasksContent}
      <div className={classes.taskList_fabContainer}>
        <Fab
          className={classes.taskList_floatingActionButton}
          color="primary"
          aria-label="create new task"
          onClick={handleNewTaskModalOpen}
        >
          <AddIcon />
        </Fab>
      </div>
    </>
  );
  //#endregion
};

export default TaskList;
