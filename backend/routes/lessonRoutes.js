const express = require("express");
const {
  addLesson,
  getLessons,
  deleteLesson,
  getNewestLessons,
} = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/add/:courseId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  addLesson
);
router.get("/:courseId", authMiddleware, getLessons);
router.get("/newest", authMiddleware, getNewestLessons);
router.delete(
  "/:lessonId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  deleteLesson
);
module.exports = router;
