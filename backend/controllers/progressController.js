const Progress = require("../models/Progress");

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
