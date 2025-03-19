const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  completed: { type: Boolean, default: false },
  completionDate: { type: Date },
});

module.exports = mongoose.model("Progress", ProgressSchema);
