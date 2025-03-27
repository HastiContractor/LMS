const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  updateProfilePicture
);

module.exports = router;
