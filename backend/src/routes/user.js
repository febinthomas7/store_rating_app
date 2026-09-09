const { Router } = require("express");
const {
  listStoresForUser,
  submitOrUpdateRating,
} = require("../controllers/userController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

const router = Router();

router.post("/stores", authenticateUser, listStoresForUser);
router.post("/stores/:storeId/ratings", authenticateUser, submitOrUpdateRating);

module.exports = router;
