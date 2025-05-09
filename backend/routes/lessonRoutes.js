const express = require("express");
const {
  addLesson,
  getLessons,
  deleteLesson,
  getNewestLessons,
  updateLesson,
  addQuiz,
  updateQuiz,
  deleteQuiz,
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

router.get("/newest", authMiddleware, getNewestLessons);
router.get("/:courseId", authMiddleware, getLessons);
router.put(
  "/:lessonId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  updateLesson
);
router.delete(
  "/:lessonId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  deleteLesson
);

router.post(
  "/:lessonId/quiz",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  addQuiz
);
router.put(
  "/:lessonId/quiz/:quizId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  updateQuiz
);
router.delete(
  "/:lessonId/quiz/:quizId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  deleteQuiz
);

module.exports = router;
