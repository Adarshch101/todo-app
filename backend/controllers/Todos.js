const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Todo = require("../models/Todos");
const auth = require("../middlewares/Auth");

// Create a new todo

const createtodo = async (req,res) =>{
    try {
        const { title, description, dueDate, category, completed } = req.body;
        const todo = new Todo({ title, description, dueDate, category, completed, user: req.user._id });
        await todo.save();
        res.status(201).json({ message: "Todo created successfully", todo });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get all todos for the authenticated user

const gettodos = async (req,res) =>{
    try {
        // All users see only their own todos (admins use /api/admin/todos for all todos)
        const todos = await Todo.find({ user: req.user._id });
        res.status(200).json({ todos });
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single todo by ID - owner or admin only

const gettodo = async (req,res) =>{
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id).populate("user", "username email role");
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only view your own todos." });
        }
        res.status(200).json({ todo });
    } catch (error) {
        console.error("Error fetching todo:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a todo by ID - only owner or admin can update

const updatetodo = async (req,res) =>{
    try {
        const { id } = req.params;
        const { title, description, dueDate, category, completed } = req.body;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        // Check if user is owner or admin
        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only update your own todos." });
        }
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, dueDate, category, completed },
            { new: true }
        );
        res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Delete a todo by ID - only owner or admin can delete

const deletetodo = async (req,res) =>{
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        // Check if user is owner or admin
        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only delete your own todos." });
        }
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createtodo, gettodos, updatetodo, deletetodo, gettodo };