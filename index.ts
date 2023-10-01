import express from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import {
  AuthRouter,
  MenuItemRouter,
  RestaurantRouter,
  UserRouter,
} from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/menu", MenuItemRouter);
app.use("/api/restaurants", RestaurantRouter);

mongoose.connect(process.env.MONGO_URL as string).then(
  () => {
    console.log("DB Connected!");
  },
  (err) => {
    console.log(err);
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started");
});