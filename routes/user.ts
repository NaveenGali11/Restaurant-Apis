import CryptoJS from "crypto-js";
import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import {
  checkFileType,
  uploadMiddleware,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import { Restaurant, User } from "../models";
import { formatErrorMessages, sendError, sendResponse } from "../utils";
import { updateUserValidation } from "../validations";

const router = Router();

// Update User => Admin, Own user
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  checkFileType("profilePicture"),
  updateUserValidation,
  uploadMiddleware("profilePicture", "uploads/users/"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.API_SECRET as string
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      sendResponse(res, 200, updatedUser, "User Updated Successfully");
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
);

// Retrieve All Users => Admin
router.get("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    const count = await User.countDocuments();

    sendResponse(res, 200, users, "Success", count);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
});

// Retrieve Single User => Admin
router.get("/:id", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      sendError(res, 404, "User Not Found");
    } else {
      const { password, ...others } = user.toObject();

      sendResponse(res, 200, others, "Success");
    }
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
});

// Get All User Restaurants => Owner or Admin
router.get(
  "/:id/restaurants",
  verifyTokenOwnerOrAdmin,
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const restaurants = await Restaurant.find({
        owner: userId,
      });

      const restaurantsCount = await Restaurant.countDocuments({
        owner: userId,
      });

      sendResponse(res, 200, restaurants, "Success", restaurantsCount);
    } catch (err: any) {
      sendError(res, 500, err.message);
    }
  }
);

export { router as UserRouter };
