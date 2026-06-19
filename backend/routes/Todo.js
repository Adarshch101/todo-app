const router = require("express").Router();

const { createtodo, gettodos, updatetodo, deletetodo,gettodo } = require("../controllers/Todos");
const auth = require("../middlewares/Auth");

router.post("/create", auth, createtodo);
router.get("/all", auth, gettodos);
router.get("/:id", auth, gettodo);
router.put("/update/:id", auth, updatetodo);
router.delete("/delete/:id", auth, deletetodo);

module.exports = router;