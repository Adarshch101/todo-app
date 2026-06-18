const express = require("express");
const Todo = require("../models/Todos");
const User = require("../models/User");

// Admin: Get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate("user", "username email role");
    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching all todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get todos for a specific user
const getUserTodos = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const todos = await Todo.find({ user: userId }).populate("user", "username email role");
    res.status(200).json({ user: { _id: user._id, username: user.username, email: user.email }, todos });
  } catch (error) {
    console.error("Error fetching user todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Create a todo for themselves
const createAdminTodo = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body;
    const todo = new Todo({
      title,
      description,
      dueDate,
      category,
      completed,
      user: req.user._id
    });
    await todo.save();
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Create a todo for another user
const createTodoForUser = async (req, res) => {
  try {
    const { userId, title, description, dueDate, category, completed } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const todo = new Todo({
      title,
      description,
      dueDate,
      category,
      completed,
      user: userId
    });
    await todo.save();
    res.status(201).json({ message: "Todo created successfully for user", todo });
  } catch (error) {
    console.error("Error creating todo for user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Update any todo
const updateAnyTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, category, completed } = req.body;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, dueDate, category, completed },
      { new: true }
    ).populate("user", "username email role");
    res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete any todo
const deleteAnyTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTodos,
  getUserTodos,
  createAdminTodo,
  createTodoForUser,
  updateAnyTodo,
  deleteAnyTodo,
  getAllUsers
};
