import TaskList from "./components/TaskList";

interface TaskPageProps {}

const TaskPage: React.FC<TaskPageProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <TaskList />
    </>
  );
  //#endregion
};

export default TaskPage;
