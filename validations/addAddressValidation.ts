import { ValidationChain, check } from "express-validator";

export const addAddressValidation: ValidationChain[] = [
  check("line1")
    .notEmpty()
    .withMessage("Address Line 1 cannot be empty")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Line1 must be at least 5 characters"),
  check("line2")
    .optional()
    .notEmpty()
    .withMessage("Address Line 1 cannot be empty")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Line1 must be at least 5 characters"),
  check("latitude")
    .notEmpty()
    .withMessage("Latitude cannot be empty")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),
  check("longitude")
    .notEmpty()
    .withMessage("Longitude cannot be empty")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
  check("city")
    .notEmpty()
    .withMessage("City cannot be empty")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),
  check("state")
    .notEmpty()
    .withMessage("State cannot be empty")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),
  check("zipCode")
    .notEmpty()
    .withMessage("Zip Code cannot be empty")
    .isPostalCode("IN")
    .withMessage("Zip Code must be a valid postal code"),
  check("type")
    .notEmpty()
    .withMessage("Address Type cannot be empty")
    .isIn(["home", "work", "other"])
    .withMessage('Address Type must be either "home", "work", or "other"'),
  check("country")
    .notEmpty()
    .withMessage("Country cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),
];
