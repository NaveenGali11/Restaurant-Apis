import { ValidationChain, check } from "express-validator";

export const loginValidation: ValidationChain[] = [
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .bail()
    .isEmail()
    .withMessage("Please Enter a Valid Email Address"),
];
