const express = require("express");

// Middleware to check if user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
