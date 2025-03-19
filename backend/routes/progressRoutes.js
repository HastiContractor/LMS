const express = require("express");
const {
  markLessonComplete,
  getUserProgress,
} = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/complete", authMiddleware, markLessonComplete);
router.get("/", authMiddleware, getUserProgress);

module.exports = router;
