const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  type: {
    type: String,
    enum: ["lesson", "quiz", "assignment"],
    default: "lesson",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", LessonSchema);
