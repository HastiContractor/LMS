const express = require("express");
const upload = require("../config/multer");
const {
  uploadAssignment,
  getAssignments,
} = require("../controllers/assignmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Upload assignment (Students)
router.post(
  "/assignments",
  authMiddleware,
  upload.single("file"),
  uploadAssignment
);
router.get("/assignments", authMiddleware, getAssignments);

module.exports = router;
