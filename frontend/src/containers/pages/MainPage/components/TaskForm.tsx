import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";

import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { useUserContext } from "../../../../shared/contexts/UserContext";
import { useForm } from "../../../../shared/hooks/useForm";
import {
  VALIDATOR_ISODATE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../shared/utils/FormValidator";
import useNewTaskFormStyles from "./TaskFormStyles";

interface TaskFormProps {
  getUserTasks: () => Promise<void>;
  onClose: () => void;
  task?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ getUserTasks, onClose, task }) => {
  //#region Styles ------------------------------------------------------------
  const classes = useNewTaskFormStyles();
  //#endregion

  //#region Context -----------------------------------------------------------
  const [user]: any = useUserContext();
  //#endregion

  //#region Routing -----------------------------------------------------------
  const params: any = useParams();
  //#endregion

  //#region Create task mutation ----------------------------------------------
  const createTaskMutation = async () => {
    const newTask = {
      title: formState.inputs.title.value,
      dueDateTime: formState.inputs.dueDateTime.value,
      category: formState.inputs.category.value,
    };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/tasks`, newTask)
      .then(async (res) => {
        if (res.status === 201 && getUserTasks) {
          await getUserTasks();
        }
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Create task mutation ----------------------------------------------
  const updateTaskMutation = async () => {
    const updatedTask = {
      title: formState.inputs.title.value,
      dueDateTime: formState.inputs.dueDateTime.value,
      category: formState.inputs.category.value,
    };
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URI}/tasks/${task._id}`,
        updatedTask
      )
      .then(async (res) => {
        if (res.status === 200 && getUserTasks) {
          getUserTasks();
        }
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion

  //#region Basic form management ---------------------------------------------
  const [
    formState,
    formDispatch,
    formInputHandler,
    formBlurHandler,
    formSubmitHandler,
  ] = useForm(
    {
      title: {
        value: "",
        isUsed: false,
        isValid: false,
        requirements: [VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(100)],
        failedRequirements: [],
        errorMessage: "",
        helperText: "100 char max limit",
      },
      dueDateTime: {
        value: null,
        isUsed: false,
        isValid: true,
        requirements: [VALIDATOR_ISODATE()],
        failedRequirements: [],
        errorMessage: "",
        helperText: "Format: dd/mm/yyyy|Format: 08:00 AM",
      },
      category: {
        value: "",
        isUsed: false,
        isValid: true,
        requirements: [],
        failedRequirements: [],
        errorMessage: "",
        helperText: "",
      },
    },
    false
  );

  /**
   * This method acts as an intermediary step before the form input handler
   * because the select throws events without an `event.target.id` field. For
   * those cases, the event is manually overwritten to be compatible with the
   * useForm hook.
   */
  const handleCategoryChange = (event: any) => {
    if (!event) {
      return;
    }
    if (
      !event.target.hasOwnProperty("value") ||
      !event.target.hasOwnProperty("id")
    ) {
      event = {
        target: {
          value: event.target.value,
          id: "category",
        },
      };
    }
    formInputHandler(event);
  };

  /**
   * The following 2 methods are used as an intermediary step before the form
   * input/blur handlers because, although separate in the form, date and time
   * are stored as a single DateTime object in the form. Since two tags can't
   * have the same ID, event IDs are manually set here to be compatible with
   * the useForm hook.
   */
  const handleDueDateTimeChange = (date: Date | null) => {
    const event = {
      target: {
        value: date,
        id: "dueDateTime",
      },
    };
    formInputHandler(event);
  };

  const handleDueDateTimeBlur = (event: any) => {
    event = {
      target: {
        id: "dueDateTime",
      },
    };
    formBlurHandler(event);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    formSubmitHandler(e);
    if (formState.isValid) {
      try {
        if (task) {
          await updateTaskMutation();
        } else {
          await createTaskMutation();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  //#endregion

  //#region Initialization ----------------------------------------------------
  useEffect(() => {
    // Populate form with task info if updating task
    if (task) {
      for (const input in formState.inputs) {
        formDispatch({
          type: "CHANGE",
          value: task[input],
          input: input,
        });
      }
    }
    // Populate form category with working list if applicable
    else {
      formDispatch({
        type: "CHANGE",
        value: user.lists.includes(params.taskList)
          ? params.taskList
          : "Default",
        input: "category",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDispatch, task, params.tasklist, user]);
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Container maxWidth="sm">
        <form
          className={classes.newTaskForm_formContainer}
          noValidate
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <Typography className={classes.newTaskForm_title} variant="h5">
            {task ? "Update Task" : "New Task"}
          </Typography>
          <Typography
            className={classes.newTaskForm_formLabel}
            variant="caption"
          >
            Title *
          </Typography>
          <TextField
            id="title"
            variant="outlined"
            value={formState.inputs.title.value}
            onChange={formInputHandler}
            onBlur={formBlurHandler}
            error={
              formState.inputs.title.isUsed && !formState.inputs.title.isValid
            }
            helperText={
              formState.inputs.title.errorMessage &&
              formState.inputs.title.isUsed
                ? formState.inputs.title.errorMessage
                : formState.inputs.title.helperText
            }
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Typography
              className={classes.newTaskForm_formLabel}
              variant="caption"
            >
              Due Date
            </Typography>
            <KeyboardDatePicker
              inputVariant="outlined"
              format="dd/MM/yyyy"
              value={formState.inputs.dueDateTime.value}
              onChange={handleDueDateTimeChange}
              onBlur={handleDueDateTimeBlur}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              error={
                formState.inputs.dueDateTime.isUsed &&
                !formState.inputs.dueDateTime.isValid
              }
              helperText={
                formState.inputs.dueDateTime.errorMessage &&
                formState.inputs.dueDateTime.isUsed
                  ? formState.inputs.dueDateTime.errorMessage
                  : formState.inputs.dueDateTime.helperText.split("|")[0]
              }
            />
            <Typography
              className={classes.newTaskForm_formLabel}
              variant="caption"
            >
              Due Time
            </Typography>
            <KeyboardTimePicker
              inputVariant="outlined"
              value={formState.inputs.dueDateTime.value}
              onChange={handleDueDateTimeChange}
              onBlur={handleDueDateTimeBlur}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
              error={
                formState.inputs.dueDateTime.isUsed &&
                !formState.inputs.dueDateTime.isValid
              }
              helperText={
                formState.inputs.dueDateTime.errorMessage &&
                formState.inputs.dueDateTime.isUsed
                  ? formState.inputs.dueDateTime.errorMessage
                  : formState.inputs.dueDateTime.helperText.split("|")[1]
              }
            />
          </MuiPickersUtilsProvider>
          <Typography
            className={classes.newTaskForm_formLabel}
            variant="caption"
          >
            Category
          </Typography>
          <Select
            labelId="category"
            id="category"
            variant="outlined"
            value={formState.inputs.category.value}
            onChange={handleCategoryChange}
          >
            {user.lists.map((listName: string) => (
              <MenuItem key={listName} value={listName}>
                {listName}
              </MenuItem>
            ))}
          </Select>
          <Button
            className={classes.newTaskForm_submitButton}
            type="submit"
            variant="contained"
            color="primary"
            onClick={submitHandler}
          >
            {task ? "Update" : "Create"}
          </Button>
        </form>
      </Container>
    </>
  );
  //#endregion
};

export default TaskForm;
