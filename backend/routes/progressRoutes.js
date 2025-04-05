const express = require("express");
const {
  markLessonComplete,
  getUserProgress,
  getUserProgressWithPercentage,
  getCourseStatus,
} = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/complete", authMiddleware, markLessonComplete);
router.get("/", authMiddleware, getUserProgress);
router.get("/summary", authMiddleware, getUserProgressWithPercentage);
router.get("/progress/status", authMiddleware, getCourseStatus);

module.exports = router;
