const express = require("express");
const router = express.Router();
const { generateCertificate } = require("../controllers/certificateController");

router.get("/download-certificate/:userName/:courseName", generateCertificate);

module.exports = router;
