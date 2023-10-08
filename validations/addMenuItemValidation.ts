import { check, ValidationChain } from "express-validator";

export const addMenuItemValidation: ValidationChain[] = [
  check("name")
    .notEmpty()
    .withMessage("Menu Item Name Cannot be empty")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Menu Item Name Should be a min of 3 characters long"),

  check("description")
    .notEmpty()
    .withMessage("Menu Item Description Can not be empty")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Menu Item Name Should be a min of 3 characters long"),
  check("price")
    .notEmpty()
    .withMessage("Menu Item Price Can not be empty")
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage("Price Cannot be 0 or below 0"),
];
