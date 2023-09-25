const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL).then(
  () => {
    console.log("DB Connected!");
  },
  (err) => {
    console.log(err);
  }
);
