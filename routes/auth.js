const router = require("express").Router();

const User = require("../models/User");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// SIGN UP or REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.API_SECRET
    ).toString(),
    profilePicture: req.body.profilePicture,
    role: req.body.role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log("err: ", err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.send(401).json("User Not Found");
    }

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.API_SECRET
    );

    const password1 = hashPassword.toString(CryptoJS.enc.Utf8);

    if (password1 !== req.body.password) {
      return res.status(401).json("Incorrect Credentials");
    }

    const accessToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
