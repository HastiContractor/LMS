const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  fileUrl: { type: String, required: true }, // Path to uploaded file
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
