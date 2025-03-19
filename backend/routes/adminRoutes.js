const express = require("express");
const {
  getAllAssignments,
  reviewAssignment,
} = require("../controllers/assignmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/assignments", authMiddleware, getAllAssignments);
router.put("/assignments/review", authMiddleware, reviewAssignment);

module.exports = router;
