const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sections: [SectionSchema],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", LessonSchema);
