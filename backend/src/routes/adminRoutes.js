const { Router } = require("express");
const {
  createUser,
  createStore,
  getDashboard,
  listUsers,
  listStores,
  getUserDetails,
} = require("../controllers/adminController.js");
// import { authenticate } from '../middleware/auth';

const router = Router();

router.post("/users", createUser);
router.post("/stores", createStore);
router.get("/dashboard", getDashboard);
router.get("/list-users", listUsers);
router.get("/list-stores", listStores);
router.get("/user/:id", getUserDetails);

module.exports = router;
