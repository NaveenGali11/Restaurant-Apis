import { ValidationChain, check } from "express-validator";

export const registerValidation: ValidationChain[] = [
  check("username")
    .notEmpty()
    .withMessage("User Name is Required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("User Name should be min of 8 characters long "),

  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .bail()
    .isEmail()
    .withMessage("Please Enter a Valid Email Address"),

  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character")
    .not()
    .matches(/^(.)\1+$/)
    .withMessage("Password cannot contain repeated characters"),
];
