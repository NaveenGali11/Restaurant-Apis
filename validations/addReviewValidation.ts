import { ValidationChain, check } from "express-validator";

export const addReviewValidation: ValidationChain[] = [
  check("rating").notEmpty().trim().withMessage("Rating is Required"),
  check("comment").custom((value) => {
    if (/<\/?[a-z][\s\S]*>/i.test(value)) {
      throw new Error("HTML code is not allowed in the comment");
    }
    return true;
  }),
];
