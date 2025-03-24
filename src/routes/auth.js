// routes/auth.js
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../config/config')

router.post("/register", async (req, res) => {
  try {
    const { lastname, name, login, password, contact } = req.body;

    if (!lastname || !name || !login || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      lastname,
      name,
      login,
      password: hashedPassword,
      contact,
      profil: "USER",
    });

    await user.save();
    res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await UserModel.findOne({ login: login });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id, userLogin: user.login, role: user.profil },
                              config.jwtSecret, {
                              expiresIn: "1h",
                            });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
