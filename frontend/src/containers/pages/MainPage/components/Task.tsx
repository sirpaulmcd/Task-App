import React from "react";

import { Paper, Typography } from "@material-ui/core";

import useTaskStyles from "./TaskStyles";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  dueDateTime: string;
  category: string;
  completed: string;
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

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <li>
        <Paper className={classes.task_paper}>
          <Typography>Title: {title}</Typography>
          <Typography>Description: {description}</Typography>
          <Typography>Due: {dueDateTime}</Typography>
          <Typography>Category: {category}</Typography>
          <Typography>Completed: {completed.toString()}</Typography>
        </Paper>
      </li>
    </>
  );
  //#endregion
};

export default Task;
