const Lesson = require("../models/Lesson");

// Add a lesson to a course
exports.addLesson = async (req, res) => {
  try {
    const { title, sections } = req.body;
    const courseId = req.params.courseId;

    const newLesson = new Lesson({
      title,
      sections,
      course: courseId,
    });

    await newLesson.save();
    res.status(201).json({ message: "Lesson added", lesson: newLesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get lessons for a specific course
exports.getLessons = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessons = await Lesson.find({ course: courseId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a lesson (only instructors/admins)
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get newest lessons sorted by createdAt
exports.getNewestLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .sort({ createdAt: -1 }) // Sort in descending order (newest first)
      .limit(5) // Limit to the latest 5 lessons
      .populate("course", "title"); // Populate course title

    res.json(lessons);
  } catch (error) {
    console.error("Error fetching newest lessons:", error);
    res.status(500).json({ message: "Server error" });
  }
};
