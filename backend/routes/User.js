const router = require("express").Router();
const { registerUser, loginUser, promoteToAdmin } = require("../controllers/Users");
const auth = require("../middlewares/Auth");
const adminMiddleware = require("../middlewares/Admin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/promote", auth, adminMiddleware, promoteToAdmin);

module.exports = router;