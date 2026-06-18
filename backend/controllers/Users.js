const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");




// register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser  = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "User already exists"});
    }
    const checkemail = email.toLowerCase();
    if (!/\S+@\S+\.\S+/.test(checkemail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if(password.length < 8){
      return res.status(400).json({message: "Password must be at least 8 characters"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword, role: "user" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "Invalid credentials"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jsonwebtoken.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  } 
};

// Promote a user to admin - only admin can perform this action
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({ message: "User promoted to admin successfully", user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, promoteToAdmin };