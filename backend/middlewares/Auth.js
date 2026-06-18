const express = require("express");
const router = express.Router();
const User = require("../models/User");


// Middleware to authenticate user using JWT and also verify if the user is an admin
const jsonwebtoken = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")|| req.cookies.token|| req.body.token;
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(401).json({ message: "Token is not valid" });
  } 
};

module.exports = auth;