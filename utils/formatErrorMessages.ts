import { ValidationError } from "express-validator";

export const formatErrorMessages = (
  validationErrors: Record<string, ValidationError>
) => {
  const errorMessages: string[] = Object.values(validationErrors).map(
    (error) => error.msg
  );

  return errorMessages.join(" , ");
};
