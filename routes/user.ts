import { Request, Response, Router } from "express";
import CryptoJS from "crypto-js";

import {
  checkFileType,
  jwtUser,
  uploadMiddleware,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import { Restaurant, User } from "../models";

const router = Router();

// Update User => Admin, Own user
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  checkFileType("profilePicture"),
  uploadMiddleware("profilePicture", "uploads/users/"),
  async (req: Request, res: Response) => {
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

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Retrieve All Users => Admin
router.get("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Retrieve Single User => Admin
router.get("/:id", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json("User Not Found");
    } else {
      const { password, ...others } = user.toObject();

      res.status(200).json(others);
    }
  } catch (err) {
    res.status(500).json(err);
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

      res.status(200).json(restaurants);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export { router as UserRouter };
