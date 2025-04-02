const express = require("express");
const router = express.Router();
const { getReports, createReport } = require("../controllers/reportController");

router.get("/", getReports);
router.post("/", createReport);

module.exports = router;
