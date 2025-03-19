const express = require("express");
const {
  createCourse,
  getCourses,
  enrollCourse,
  deleteCourse,
  countCourse,
  totalStudents,
  getInstructorCourses,
} = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createCourse);
router.get("/", getCourses);
router.get("/instructor/:id", authMiddleware, getInstructorCourses);
router.get("/count/:id", authMiddleware, countCourse);
router.get("/students/count/:id", authMiddleware, totalStudents);
router.post("/enroll/:courseId", authMiddleware, enrollCourse);
router.delete("/:courseId", authMiddleware, deleteCourse);

module.exports = router;
