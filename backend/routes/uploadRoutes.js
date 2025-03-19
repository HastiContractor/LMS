const express = require("express");
const upload = require("../config/multer");
const {
  uploadAssignment,
  getAssignments,
} = require("../controllers/assignmentController");
const {
  issueCertificate,
  getCertificates,
} = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Upload assignment (Students)
router.post(
  "/assignments",
  authMiddleware,
  upload.single("file"),
  uploadAssignment
);
router.get("/assignments", authMiddleware, getAssignments);

// Issue certificate (Admins/Instructors)
router.post("/certificates", authMiddleware, issueCertificate);
router.get("/certificates", authMiddleware, getCertificates);

module.exports = router;
