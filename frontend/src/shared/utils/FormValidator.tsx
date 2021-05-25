import validator from "validator";

export interface ValidationRequirement {
  type: string;
  val?: number;
}

export const ValidationType = {
  REQUIRE: "REQUIRE",
  MINLENGTH: "MINLENGTH",
  MAXLENGTH: "MAXLENGTH",
  MIN: "MIN",
  MAX: "MAX",
  EMAIL: "EMAIL",
  FILE: "FILE",
  ALPHA: "APLHA",
  ALPHANUMERIC: "ALPHANUMERIC",
  ALPHAWHITESPACE: "ALPHAWHITESPACE",
};

//#region Form validation options =============================================

export const VALIDATOR_REQUIRE = () => ({
  type: ValidationType.REQUIRE,
});
export const VALIDATOR_FILE = () => ({
  type: ValidationType.FILE,
});
export const VALIDATOR_MINLENGTH = (val: number) => ({
  type: ValidationType.MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val: number) => ({
  type: ValidationType.MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val: number) => ({
  type: ValidationType.MIN,
  val: val,
});
export const VALIDATOR_MAX = (val: number) => ({
  type: ValidationType.MAX,
  val: val,
});
export const VALIDATOR_EMAIL = () => ({
  type: ValidationType.EMAIL,
});

export const VALIDATOR_ALPHA = () => ({
  type: ValidationType.ALPHA,
});

export const VALIDATOR_ALPHA_WHITESPACE = () => ({
  type: ValidationType.ALPHAWHITESPACE,
});

export const VALIDATOR_ALPHANUMERIC = () => ({
  type: ValidationType.ALPHANUMERIC,
});

//#endregion

//#region Form validation methods =============================================

const isEmpty = (value: string): boolean => {
  return validator.isEmpty(value);
};

const isMinLength = (
  value: string,
  requirement: ValidationRequirement
): boolean => {
  return validator.isLength(value, { min: requirement.val });
};

const isMaxLength = (
  value: string,
  requirement: ValidationRequirement
): boolean => {
  return validator.isLength(value, { max: requirement.val });
};

const isMax = (value: string, requirement: ValidationRequirement): boolean => {
  return +value >= requirement.val!;
};

const isMin = (value: string, requirement: ValidationRequirement): boolean => {
  return +value <= requirement.val!;
};

const isEmail = (value: string): boolean => {
  return validator.isEmail(value);
};

const isAlpha = (value: string): boolean => {
  return validator.isAlpha(value);
};

const isAlphanumeric = (value: string): boolean => {
  return validator.isAlphanumeric(value);
};

const isAlphaWhitespace = (value: string): boolean => {
  // @ts-ignore
  return validator.isAlpha(value, ["en-US"], { ignore: " " });
};

//#endregion

//#region Generic validate method =============================================

export const validateFormInputs = (
  value: string,
  requirements: ValidationRequirement[]
) => {
  let failedRequirements: ValidationRequirement[] = [];
  for (const requirement of requirements) {
    if (requirement.type === ValidationType.REQUIRE && isEmpty(value)) {
      failedRequirements.push(requirement);
    }
    if (
      requirement.type === ValidationType.MINLENGTH &&
      !isMinLength(value, requirement)
    ) {
      failedRequirements.push(requirement);
    }
    if (
      requirement.type === ValidationType.MAXLENGTH &&
      !isMaxLength(value, requirement)
    ) {
      failedRequirements.push(requirement);
    }
    if (requirement.type === ValidationType.MIN && !isMin(value, requirement)) {
      failedRequirements.push(requirement);
    }
    if (requirement.type === ValidationType.MAX && !isMax(value, requirement)) {
      failedRequirements.push(requirement);
    }
    if (requirement.type === ValidationType.EMAIL && !isEmail(value)) {
      failedRequirements.push(requirement);
    }
    if (requirement.type === ValidationType.ALPHA && !isAlpha(value)) {
      failedRequirements.push(requirement);
    }
    if (
      requirement.type === ValidationType.ALPHANUMERIC &&
      !isAlphanumeric(value)
    ) {
      failedRequirements.push(requirement);
    }
    if (
      requirement.type === ValidationType.ALPHAWHITESPACE &&
      !isAlphaWhitespace(value)
    ) {
      failedRequirements.push(requirement);
    }
  }
  return failedRequirements;
};

//#endregion

//#region Error message generation ============================================

export const generateErrorMessage = (
  failedRequirements: ValidationRequirement[]
): string => {
  if (failedRequirements.length === 0) {
    return "";
  }
  let newErrorMessage = `Input must: `;
  let firstError = true;
  for (const requirement of failedRequirements) {
    firstError ? (firstError = false) : (newErrorMessage += ", ");
    if (requirement.type === ValidationType.REQUIRE) {
      newErrorMessage += `be filled`;
    }
    if (requirement.type === ValidationType.MINLENGTH) {
      newErrorMessage += `have a min length of ${requirement.val}`;
    }
    if (requirement.type === ValidationType.MAXLENGTH) {
      newErrorMessage += `have a max length of ${requirement.val}`;
    }
    if (requirement.type === ValidationType.MIN) {
      newErrorMessage += `be greater than or equal to ${requirement.val}`;
    }
    if (requirement.type === ValidationType.MAX) {
      newErrorMessage += `be less than or equal to ${requirement.val}`;
    }
    if (requirement.type === ValidationType.EMAIL) {
      newErrorMessage += `be a valid email`;
    }
    if (requirement.type === ValidationType.FILE) {
      newErrorMessage += `be a file`;
    }
    if (requirement.type === ValidationType.ALPHA) {
      newErrorMessage += `only contain letters`;
    }
    if (requirement.type === ValidationType.ALPHANUMERIC) {
      newErrorMessage += `only contain letters and numbers`;
    }
    if (requirement.type === ValidationType.ALPHAWHITESPACE) {
      newErrorMessage += `only contain letters and spaces`;
    }
  }
  return newErrorMessage;
};

//#endregion
