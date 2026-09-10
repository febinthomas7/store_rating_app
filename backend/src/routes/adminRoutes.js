const { Router } = require("express");
const {
  createUser,
  createStore,
  getDashboard,
  listUsers,
  listStores,
  getUserDetails,
} = require("../controllers/adminController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

const router = Router();

router.post("/users", authenticateUser, createUser);
router.post("/stores", authenticateUser, createStore);
router.get("/dashboard", authenticateUser, getDashboard);
router.get("/list-users", authenticateUser, listUsers);
router.get("/list-stores", authenticateUser, listStores);
router.get("/user/:id", authenticateUser, getUserDetails);

module.exports = router;
