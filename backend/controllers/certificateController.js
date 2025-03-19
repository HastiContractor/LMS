const Certificate = require("../models/Certificate");

// Issue a certificate
exports.issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId, certificateUrl } = req.body;

    const certificate = new Certificate({
      student: studentId,
      course: courseId,
      certificateUrl,
    });

    await certificate.save();
    res.json({ message: "Certificate issued successfully", certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get certificates for a student
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      student: req.user.id,
    }).populate("course");
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
