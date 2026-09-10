const { Router } = require("express");
const {
  signup,
  login,
  checkAuth,
  updatePassword,
  logout,
} = require("../controllers/authController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/password", authenticateUser, updatePassword);
router.get("/me", checkAuth); // New route to check authentication status
router.post("/logout", authenticateUser, logout); // New route to check authentication status

module.exports = router;
