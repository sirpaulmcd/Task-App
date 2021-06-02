import { useCallback, useReducer } from "react";

import {
  generateErrorMessage,
  validateFormInputs
} from "../utils/FormValidator";

//#region Form reducer ========================================================

/**
 * Validates the form by checking if any newly updated fields have failed
 * requirements and if any unchanged fields are still invalid.
 * @param state The current form state.
 * @param action The dispatch inputs. Object with type, value, and input fields.
 * @param failedRequirements List of failed requirements.
 * @returns True if form is valid, false otherwise.
 */
const validateForm = (
  state: any,
  action: any,
  failedRequirements: any
): boolean => {
  for (const input in state.inputs) {
    // If newly changed form field has failed requirements...
    if (input === action.input && failedRequirements.length > 0) {
      return false;
    }
    // Else if any other form field is invalid...
    else if (input !== action.input && !state.inputs[input].isValid) {
      return false;
    }
  }
  return true;
};

/**
 * When formDispatch is called, processes changes to form state.
 * @param state The current form state.
 * @param action The dispatch inputs. Object with type, value, and input fields.
 * @returns The updated form state.
 */
const formReducer = (state: any, action: any): any => {
  switch (action.type) {
    // Updates field and validates form on change
    case "CHANGE":
      const failedRequirements = validateFormInputs(
        action.value,
        state.inputs[action.input].requirements
      );
      const formIsValid = validateForm(state, action, failedRequirements);
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.input]: {
            ...state.inputs[action.input],
            value: action.value,
            failedRequirements: failedRequirements,
            isValid: failedRequirements.length > 0 ? false : true,
            errorMessage:
              failedRequirements.length > 0
                ? generateErrorMessage(failedRequirements)
                : "",
          },
        },
        isValid: formIsValid,
      };
    // Marks the dispatched field as "used"
    case "BLUR":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.input]: {
            ...state.inputs[action.input],
            isUsed: true,
          },
        },
      };
    // Invalidates the dispatched field
    case "INVALIDATE":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.input]: {
            ...state.inputs[action.input],
            errorMessage: action.errorMessage,
            isValid: false,
            isUsed: true,
          },
        },
      };
    default:
      return state;
  }
};

//#endregion

//#region useForm hook ========================================================

export const useForm = (initialInputs: any, initialFormValidity: any) => {
  const [formState, formDispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  /**
   * To be called in OnBlur property of form fields
   */
  const formBlurHandler = useCallback((event: any) => {
    if (event.target.value !== "") {
      formDispatch({
        type: "BLUR",
        input: event.target.id,
      });
    }
  }, []);

  /**
   * To be called in OnChange property of form fields
   */
  const formInputHandler = useCallback((event: any) => {
    formDispatch({
      type: "CHANGE",
      value: event.target.value,
      input: event.target.id,
    });
  }, []);

  /**
   * To be called when a form is submitted. Runs change and blur dispatches on
   * all inputs to ensure that inputs that have not been touched are checked
   * for validity.
   */
  // To be called when a form is submitted
  const formSubmitHandler = useCallback(
    (event: any) => {
      for (const input in formState.inputs) {
        formDispatch({
          type: "CHANGE",
          value: formState.inputs[input].value,
          input: input,
        });
        formDispatch({
          type: "BLUR",
          input: input,
        });
      }
    },
    [formState.inputs]
  );

  return [
    formState,
    formDispatch,
    formInputHandler,
    formBlurHandler,
    formSubmitHandler,
  ];
};

//#endregion
