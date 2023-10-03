import { Router, Request, Response } from "express";

import { AES, enc } from "crypto-js";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const API_SECRET = process.env.API_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// SIGN UP or REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: AES.encrypt(req.body.password, API_SECRET ?? "").toString(),
    profilePicture: req.body.profilePicture,
    role: req.body.role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json("User Not Found");
    } else if (!API_SECRET || !JWT_SECRET) {
      return res.status(500).json("Internal Server Error");
    } else {
      const hashPassword = AES.decrypt(user.password, API_SECRET);

      const password1 = hashPassword.toString(enc.Utf8);

      if (password1 !== req.body.password) {
        return res.status(401).json("Incorrect Credentials");
      }

      const accessToken = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user.toObject();
      return res.status(200).json({ ...others, accessToken });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

export { router as AuthRouter };
