const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  price: { type: Number, required: true, default: 0 }, // Course price
  image: { type: String, default: "assets/default.png" }, // Image URL
  label: { type: String, default: "New" }, // Optional label (e.g., "Popular")
  labelColor: { type: String, default: "green" }, // Optional color for label
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", CourseSchema);
