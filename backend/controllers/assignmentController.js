const Assignment = require("../models/Assigment");

// Get all assignments (Admin)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("student course");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark assignment as reviewed (Admin)
exports.reviewAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    await Assignment.findByIdAndUpdate(assignmentId, { status: "Reviewed" });

    res.json({ message: "Assignment marked as reviewed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload assignment
exports.uploadAssignment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { courseId } = req.body;

    const assignment = new Assignment({
      student: req.user.id,
      course: courseId,
      fileUrl: req.file.path,
    });

    await assignment.save();
    res.json({ message: "Assignment uploaded successfully", assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all assignments for a student
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      student: req.user.id,
    }).populate("course");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
