const CryptoJS = require("crypto-js");

const {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
  verifyTokenOwnerOrAdmin,
} = require("../middlewares/verifytoken");

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

const router = require("express").Router();

// Update User => Admin, Own user
router.put("/:id", verifyTokenAndAutherization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.API_SECRET
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
});

// Retrieve All Users => Admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Retrieve Single User => Admin
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All User Restaurants => Owner or Admin
router.get("/:id/restaurants", verifyTokenOwnerOrAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const restaurants = await Restaurant.find({
      owner: userId,
    });

    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
