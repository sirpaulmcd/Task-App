import React from "react";

import { Container, Typography } from "@material-ui/core";

import Task from "./Task";
import useTaskListStyles from "./TaskListStyles";

interface TaskListProps {
  tasks: any;
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  //#region Styles ------------------------------------------------------------
  const classes = useTaskListStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  if (tasks.length === 0) {
    return <Typography>No tasks.</Typography>;
  }
  return (
    <>
      <Container maxWidth="sm">
        <ul className={classes.taskList_unorderedList}>
          {tasks.map((task: any) => (
            <Task
              key={task._id}
              id={task._id}
              title={task.title}
              description={task.description}
              dueDateTime={task.dueDateTime}
              category={task.category}
              completed={task.completed}
            />
          ))}
        </ul>
      </Container>
    </>
  );
  //#endregion
};

export default TaskList;
