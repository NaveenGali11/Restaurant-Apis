const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const restaurantRouter = require("./routes/restaurant");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/restaurants", restaurantRouter);

mongoose.connect(process.env.MONGO_URL).then(
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
