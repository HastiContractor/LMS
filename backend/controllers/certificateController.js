const PDFDocument = require("pdfkit");

exports.generateCertificate = (req, res) => {
  const { userName, courseName } = req.params;
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${userName}_Certificate.pdf`
  );

  doc.pipe(res);

  // Certificate Design
  doc.fontSize(25).text("Certificate of Completion", { align: "center" });

  doc.moveDown();
  doc.fontSize(20).text(`This is to certify that`, { align: "center" });

  doc.moveDown();
  doc.fontSize(30).fillColor("blue").text(`${userName}`, { align: "center" });

  doc.moveDown();
  doc.fontSize(20).fillColor("black").text(`has successfully completed`, {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(25).fillColor("green").text(`${courseName}`, {
    align: "center",
  });

  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("black")
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

  doc.end();
};
