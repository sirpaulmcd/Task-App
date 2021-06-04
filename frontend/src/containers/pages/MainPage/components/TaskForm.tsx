import axios from "axios";
import React, { useEffect } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { useForm } from "../../../../shared/hooks/useForm";
import {
  VALIDATOR_ISODATE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../shared/utils/FormValidator";
import useNewTaskFormStyles from "./TaskFormStyles";

interface TaskFormProps {
  appendTaskToList?: (task: any) => void;
  updateTaskInList?: (updatedTask: any) => void;
  onClose: () => void;
  task?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  appendTaskToList,
  updateTaskInList,
  onClose,
  task,
}) => {
  //#region Styles ------------------------------------------------------------
  const classes = useNewTaskFormStyles();
  //#endregion

  //#region Create task mutation ----------------------------------------------
  const createTaskMutation = async () => {
    const newTask = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      dueDateTime: formState.inputs.dueDateTime.value,
      category: formState.inputs.category.value,
    };
    await axios
      .post("http://localhost:8000/tasks", newTask)
      .then(async (res) => {
        if (appendTaskToList) {
          appendTaskToList(res.data);
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
      description: formState.inputs.description.value,
      dueDateTime: formState.inputs.dueDateTime.value,
      category: formState.inputs.category.value,
    };
    await axios
      .patch(`http://localhost:8000/tasks/${task._id}`, updatedTask)
      .then(async (res) => {
        if (updateTaskInList) {
          updateTaskInList(res.data);
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
      description: {
        value: "",
        isUsed: false,
        isValid: true,
        requirements: [VALIDATOR_MAXLENGTH(1000)],
        failedRequirements: [],
        errorMessage: "",
        helperText: "1000 char max limit",
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
   * because the autocomplete box sometimes throws events without an
   * `event.target.value` field. For those cases, the event is manually
   * overwritten to be compatible with the useForm hook.
   */
  const handleCategoryChange = (event: any) => {
    if (!event) {
      return;
    }
    if (!event.target.hasOwnProperty("value")) {
      event = {
        target: {
          value: event.target.textContent,
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
    if (task) {
      for (const input in formState.inputs) {
        formDispatch({
          type: "CHANGE",
          value: task[input],
          input: input,
        });
      }
      // Populate inputs with task values
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDispatch, task]);
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Typography variant="h5">{task ? "Update Task" : "New Task"}</Typography>
      <Typography className={classes.newTaskForm_formLabel} variant="caption">
        Title *
      </Typography>
      <TextField
        id="title"
        variant="outlined"
        value={formState.inputs.title.value}
        onChange={formInputHandler}
        onBlur={formBlurHandler}
        error={formState.inputs.title.isUsed && !formState.inputs.title.isValid}
        helperText={
          formState.inputs.title.errorMessage && formState.inputs.title.isUsed
            ? formState.inputs.title.errorMessage
            : formState.inputs.title.helperText
        }
      />
      <Typography className={classes.newTaskForm_formLabel} variant="caption">
        Description
      </Typography>
      <TextField
        id="description"
        variant="outlined"
        multiline
        value={formState.inputs.description.value}
        onChange={formInputHandler}
        onBlur={formBlurHandler}
        error={
          formState.inputs.description.isUsed &&
          !formState.inputs.description.isValid
        }
        helperText={
          formState.inputs.description.errorMessage &&
          formState.inputs.description.isUsed
            ? formState.inputs.description.errorMessage
            : formState.inputs.description.helperText
        }
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography className={classes.newTaskForm_formLabel} variant="caption">
          Due Date
        </Typography>
        <KeyboardDatePicker
          margin="normal"
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
        <Typography className={classes.newTaskForm_formLabel} variant="caption">
          Due Time
        </Typography>
        <KeyboardTimePicker
          margin="normal"
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
      <Typography className={classes.newTaskForm_formLabel} variant="caption">
        Category
      </Typography>
      <Autocomplete
        id="category"
        freeSolo
        value={formState.inputs.category.value}
        onInputChange={handleCategoryChange}
        onBlur={formBlurHandler}
        options={["Hello", "Hi", "Howdy"]}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
      <Button variant="contained" color="primary" onClick={submitHandler}>
        {task ? "Update" : "Create"}
      </Button>
    </>
  );
  //#endregion
};

export default TaskForm;
