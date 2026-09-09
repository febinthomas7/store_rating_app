const { Router } = require("express");
const {
  signup,
  login,
  checkAuth,
  updatePassword,
} = require("../controllers/authController.js");
// import { authenticate } from '../middleware/auth';

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/password", updatePassword);
router.get("/me", checkAuth); // New route to check authentication status

module.exports = router;
