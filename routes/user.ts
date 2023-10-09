import { Router } from "express";
import { UserController } from "../controllers";
import {
  checkFileType,
  uploadMiddleware,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import { updateUserValidation } from "../validations";

const router = Router();

// Update User => Admin, Own user
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  checkFileType("profilePicture"),
  updateUserValidation,
  uploadMiddleware("profilePicture", "uploads/users/"),
  UserController.updateUser
);

// Retrieve All Users => Admin
router.get("/", verifyTokenAndAdmin, UserController.getAllUsers);

// Retrieve Single User => Admin
router.get("/:id", verifyTokenAndAdmin, UserController.getSingleUser);

// Get All User Restaurants => Owner or Admin
router.get(
  "/:id/restaurants",
  verifyTokenOwnerOrAdmin,
  UserController.getAllUserRestaurants
);

export { router as UserRouter };
