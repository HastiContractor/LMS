const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price, image, label, labelColor } =
      req.body;
    const newCourse = new Course({
      title,
      description,
      category,
      instructor: req.user.id,
      price: price || 0,
      image: image || "assets/default.png",
      label: label || "New",
      labelColor: labelColor || "green",
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enroll a student in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(403).json({ error: "Only students can enroll" });
    }
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      student.enrolledCourses.push(courseId);
      await course.save();
      await student.save();
      return res.json({ message: "Enrolled successfully", course });
    } else {
      return res.status(400).json({ error: "Already enrolled" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course (only instructor can delete)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Course.findByIdAndDelete(req.params.courseId);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.id;

    if (!instructorId) {
      return res.status(400).json({ error: "Instructor ID is required" });
    }

    const courses = await Course.find({ instructor: instructorId });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this instructor" });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ error: error.message });
  }
};

// API to Get Course Count by Instructor
exports.countCourse = async (req, res) => {
  try {
    const instructorId = req.params.id;
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }
    const courseCount = await Course.countDocuments({
      instructor: instructorId,
    }); // Count courses for instructor

    res.json({ totalCourses: courseCount });
  } catch (error) {
    console.error("Error fetching course count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total number of students across all courses
exports.totalStudents = async (req, res) => {
  try {
    const instructorId = req.params.id;
    //console.log("Received Instructor ID: ", instructorId)
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }
    console.log("Instructor ID received: ", instructorId);
    const courses = await Course.find({ instructor: instructorId }, "students"); // Get only student lists
    const totalStudents = courses.reduce(
      (sum, course) => sum + course.students.length,
      0
    );

    res.json({ totalStudents });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourse = await Course.find({ instructor: instructorId });
    if (!instructorCourse.length) {
      return res.json({ message: "No students found, no courses assigned." });
    }
    const courseIds = instructorCourse.map((course) => course._id);

    const students = await User.find({
      role: "student",
      enrolledCourses: { $in: courseIds },
    })
      .select("name email enrolledCourses createdAt")
      .populate({ path: "enrolledCourses", select: "title" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
