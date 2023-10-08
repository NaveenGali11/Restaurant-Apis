import { Router, Request, Response } from "express";

import { AES, enc } from "crypto-js";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models";
import dotenv from "dotenv";
import { formatErrorMessages, sendError, sendResponse } from "../utils";
import { check, validationResult } from "express-validator";
import { loginValidation, registerValidation } from "../validations";

dotenv.config();

const router = Router();

const API_SECRET = process.env.API_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// SIGN UP or REGISTER
router.post(
  "/register",
  registerValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 404, formatErrorMessages(errors.mapped()));
    }

    try {
      const existingUser = await User.findOne({
        email: req.body.email,
      });

      if (existingUser) {
        return sendError(res, 400, "User Already Exists");
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: AES.encrypt(req.body.password, API_SECRET ?? "").toString(),
        role: req.body.role,
      });

      const savedUser = await newUser.save();
      sendResponse(res, 201, savedUser, "User Created Successfully");
    } catch (err: any) {
      sendError(res, 500, err.message);
    }
  }
);

// LOGIN
router.post("/login", loginValidation, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return sendError(res, 401, "User Not Found");
    } else if (!API_SECRET || !JWT_SECRET) {
      return sendError(res, 500, "Internal Server Error");
    } else {
      const hashPassword = AES.decrypt(user.password, API_SECRET);

      const password1 = hashPassword.toString(enc.Utf8);

      if (password1 !== req.body.password) {
        return sendError(res, 401, "Incorrect Credentials");
      }

      const accessToken = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user.toObject();
      return sendResponse(
        res,
        200,
        { ...others, accessToken },
        "Logged In Successfully"
      );
    }
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
});

export { router as AuthRouter };
