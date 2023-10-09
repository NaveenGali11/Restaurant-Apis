import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Restaurant, User } from "../models";
import { formatErrorMessages, sendError, sendResponse } from "../utils";

export class UserController {
  static async updateUser(req: Request, res: Response) {
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
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});

      const count = await User.countDocuments();

      sendResponse(res, 200, users, "Success", count);
    } catch (err: any) {
      sendError(res, 500, err.message);
    }
  }
  static async getSingleUser(req: Request, res: Response) {
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
  }
  static async getAllUserRestaurants(req: Request, res: Response) {
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
}
