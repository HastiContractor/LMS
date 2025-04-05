const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");

// Mark a lesson as completed
exports.markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    const progress = await Progress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { completed: true, completionDate: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: "Lesson marked as complete", progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await Progress.find({ user: userId }).populate("lesson");
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProgressWithPercentage = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.query.courseId;

    const allLessonsInCourse = await Lesson.find({ course: courseId }).select(
      "_id"
    );
    const lessonIds = allLessonsInCourse.map((lesson) => lesson._id);

    const totalLessons = lessonIds.length;
    const completedLessons = await Progress.countDocuments({
      user: userId,
      lesson: { $in: lessonIds },
      completed: true,
    });

    const percentage =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({
      totalLessons,
      completedLessons,
      percentage: Math.round(percentage),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In progress.controller.js
exports.getCourseStatus = async (req, res) => {
  const { courseId } = req.query;
  const userId = req.user.id; // Use your auth middleware

  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      return res.json({ status: "Not Started" });
    }

    const status = progress.percentage === 100 ? "Completed" : "In Progress";
    return res.json({ status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
