const { Router } = require("express");
const { getStoreDashboard } = require("../controllers/storeOwnerController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

const router = Router();

router.get("/dashboard", authenticateUser, getStoreDashboard);

module.exports = router;
