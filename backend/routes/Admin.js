const router = require("express").Router();
const auth = require("../middlewares/Auth");
const adminMiddleware = require("../middlewares/Admin");
const {
  getAllTodos,
  getUserTodos,
  createAdminTodo,
  updateAnyTodo,
  deleteAnyTodo,
  getAllUsers
} = require("../controllers/Admin");

// Admin: Get all todos
router.get("/todos", auth, adminMiddleware, getAllTodos);

// Admin: Get todos for a specific user
router.get("/todos/:userId", auth, adminMiddleware, getUserTodos);

// Admin: Create a todo for themselves
router.post("/todos/create", auth, adminMiddleware, createAdminTodo);

// Admin: Update any todo
router.put("/todos/update/:id", auth, adminMiddleware, updateAnyTodo);

// Admin: Delete any todo
router.delete("/todos/delete/:id", auth, adminMiddleware, deleteAnyTodo);

// Admin: Get all users
router.get("/users", auth, adminMiddleware, getAllUsers);

module.exports = router;
