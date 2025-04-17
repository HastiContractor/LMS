const express = require("express");
const router = express.Router();
const {
  getInstructorDashboardReport,
} = require("../controllers/reportController");

router.get("/instructor-dashboard/:instructorId", getInstructorDashboardReport);

module.exports = router;
