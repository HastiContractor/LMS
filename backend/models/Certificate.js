const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
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
  certificateUrl: { type: String, required: true }, // Path to certificate PDF
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certificate", CertificateSchema);
