import { ValidationChain, check } from "express-validator";

export const updatedRestaurantValidation: ValidationChain[] = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Restaurant Name is Required"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Restaurant Description is Required"),
  check("latitude")
    .optional()
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Latitude is Required and it should be between -90 and 90"),
  check("longitude")
    .optional()
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Longitude is Required and it should be between -180 and 180"),
  check("address").optional().notEmpty().withMessage("Address is Required"),
  check("cusine").optional().notEmpty().withMessage("Cusine is Required"),
];
