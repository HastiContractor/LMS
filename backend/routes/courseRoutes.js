const express = require("express");
const {
  createCourse,
  getCourses,
  enrollCourse,
  updateCourse,
  deleteCourse,
  countCourse,
  totalStudents,
  getInstructorCourses,
  getStudents,
  getCourseDetails,
} = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  createCourse
);
router.get("/", getCourses);
router.get("/:courseId", getCourseDetails);
router.get("/instructor/:id", authMiddleware, getInstructorCourses);
router.get("/count/:id", authMiddleware, countCourse);
router.get("/students/count/:id", authMiddleware, totalStudents);
router.get("/students", authMiddleware, getStudents);
router.post("/enroll/:courseId", authMiddleware, enrollCourse);
router.delete(
  "/:courseId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  deleteCourse
);
router.put(
  "/:courseId",
  authMiddleware,
  roleMiddleware(["admin", "instructor"]),
  updateCourse
);

module.exports = router;
