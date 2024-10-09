const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Upload PDF Function
const uploadPdf = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('file reached in backend',req.file)
    // Respond with the file name for further processing
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

// Extract PDF Pages Function
const extractPages = async (req, res) => {
    const { selectedPages, filename } = req.body;
    console.log('extract request reached in backend',req.body)
    // Construct the PDF path
    const pdfPath = path.join(__dirname, '..', 'uploads', filename);

    try {
        // Check if the file exists
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Read the existing PDF
        const existingPdfBytes = await fs.promises.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdfDoc = await PDFDocument.create();

        // Copy and add the selected pages to the new PDF
        for (const pageIndex of selectedPages) {
            if (pageIndex > 0 && pageIndex <= pdfDoc.getPageCount()) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex - 1]);
                newPdfDoc.addPage(copiedPage);
            } else {
                return res.status(400).json({ error: `Invalid page number: ${pageIndex}` });
            }
        }

        // Save the new PDF
        const pdfBytes = await newPdfDoc.save();
        const newPdfPath = path.join(__dirname, '..', 'uploads', 'extracted.pdf');
        await fs.promises.writeFile(newPdfPath, pdfBytes);

        // Send download URL for the new PDF
        res.status(200).json({ downloadUrl: `http://localhost:5000/extracted.pdf` });
    } catch (error) {
        res.status(500).json({ error: 'Error extracting PDF: ' + error.message });
    }
};

module.exports = {
    uploadPdf,
    extractPages,
};
