const Report = require("../models/Report");

// Fetch all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { title, category, data } = req.body;
    const newReport = new Report({ title, category, data });
    await newReport.save();
    res.status(201).json({ message: "Report added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating report" });
  }
};
