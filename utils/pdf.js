const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function (data) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4'
  });
  const filePath = `bills/${data.patientId}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // --- Header Section ---
  const logoPath = path.join(__dirname, "../../frontend/src/assets/logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 40, { width: 150 });
  } else {
    // Fallback to text logo if image not found
    doc.fontSize(28).fillColor("#E65C2B").text("Vamika", 40, 40, { continued: true });
    doc.fontSize(12).fillColor("#000000").text(" (R)", { baseline: 'top' });
    doc.fontSize(12).fillColor("#000000").text("DIAGNOSTICS", 40, 70);
  }

  doc.fontSize(8).fillColor("#000000").text("It's Good to Know", 40, 95);

  // Lab Info
  doc.fillColor("#000000");
  doc.fontSize(14).text("VAMIKA DIAGNOSTICS", 250, 45, { align: "center", bold: true });
  doc.fontSize(10).text("(The Pioneers in Diagnostic Medicare..)", 250, 60, { align: "center" });
  doc.fontSize(9).text("Chimnapur, Raikode ‘X’ Road, Sangareddy Dist-502286", 250, 75, { align: "center" });
  doc.text("Hyderabad -+91 90107 36322, GST :36AAGCC8833Q1ZX", 250, 88, { align: "center" });

  doc.moveDown(2);

  // Barcode Placeholder
  doc.rect(40, 110, 515, 25).fill("#000000");
  doc.moveDown(2.5);

  // --- Patient Details Box ---
  const boxTop = 145;
  doc.rect(40, boxTop, 515, 80).stroke();

  doc.fontSize(10).fillColor("#000000");
  const col1X = 45;
  const col2X = 350;
  const labelWidth = 120;

  // Grid rows
  const rowH = 15;
  doc.text("Customer Name", col1X, boxTop + 5);
  doc.text(`: ${data.patientName.toUpperCase()}`, col1X + labelWidth, boxTop + 5, { bold: true });

  doc.text("VID", col1X, boxTop + rowH + 5);
  doc.text(`: ${data.patientId}`, col1X + labelWidth, boxTop + rowH + 5, { bold: true });

  doc.text("Date", col1X, boxTop + (rowH * 2) + 5);
  doc.text(`: ${new Date(data.createdAt).toLocaleString()}`, col1X + labelWidth, boxTop + (rowH * 2) + 5);

  doc.text("Ref By Dr.", col1X, boxTop + (rowH * 3) + 5);
  doc.text(`: ${data.referredBy || "-"}`, col1X + labelWidth, boxTop + (rowH * 3) + 5);

  doc.text("Client Name", col1X, boxTop + (rowH * 4) + 5);
  doc.text(`: Vamika Diagnostics`, col1X + labelWidth, boxTop + (rowH * 4) + 5);

  // Column 2
  doc.text("Age", col2X, boxTop + rowH + 5);
  doc.text(`: ${data.age} Years`, col2X + 60, boxTop + rowH + 5);

  doc.text("Gender", col2X, boxTop + (rowH * 2) + 5);
  doc.text(`: ${data.gender}`, col2X + 60, boxTop + (rowH * 2) + 5);

  doc.text("Email Id", col2X, boxTop + (rowH * 3) + 5);
  doc.text(`: -`, col2X + 60, boxTop + (rowH * 3) + 5);

  doc.text("UHID", col2X, boxTop + (rowH * 4) + 5);
  doc.text(`: UMR${Math.floor(100000 + Math.random() * 900000)}`, col2X + 60, boxTop + (rowH * 4) + 5);

  doc.moveDown(4);

  // --- Investigations Section ---
  doc.fontSize(11).text("Investigations", 40, doc.y, { underline: true, bold: true });
  doc.moveDown(0.5);

  let listY = doc.y;
  data.tests.forEach((t, i) => {
    doc.fontSize(10).text(`${i + 1}`, 45, listY);
    doc.text(`${t.testName}`, 70, listY);
    listY += 18;
  });

  // Bottom line for tests
  doc.strokeColor("#000000").moveTo(40, listY + 5).lineTo(555, listY + 5).stroke();

  // --- Summary ---
  doc.fontSize(11).text("Due Amount :", 350, listY + 15, { align: "right", width: 150 });
  doc.rect(410, listY + 10, 145, 20).stroke();
  doc.text(`${data.netAmount.toFixed(2)}`, 410, listY + 15, { align: "right", width: 140, bold: true });

  // --- Footer ---
  const footerY = 750;
  doc.fontSize(9).fillColor("#444444");
  doc.text(`Hyderabad - NRL / ${new Date().toLocaleString()} / Admin`, 40, footerY);

  doc.end();
  return filePath;
}
