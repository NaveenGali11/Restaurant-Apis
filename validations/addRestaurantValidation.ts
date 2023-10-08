import { ValidationChain, check } from "express-validator";

export const addRestaurantValidation: ValidationChain[] = [
  check("name").notEmpty().withMessage("Restaurant Name is Required"),
  check("description")
    .notEmpty()
    .withMessage("Restaurant Description is Required"),
  check("latitude")
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Latitude is Required and it should be between -90 and 90"),
  check("longitude")
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Longitude is Required and it should be between -180 and 180"),
  check("address").notEmpty().withMessage("Address is Required"),
  check("cusine").notEmpty().withMessage("Cusine is Required"),
];
