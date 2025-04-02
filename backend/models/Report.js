const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // Example: "Student Progress"
  data: { type: Object, required: true }, // Store chart data (like labels, values)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);
