const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const uploadPdf = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

const extractPages = async (req, res) => {
    const { selectedPages, filename } = req.body;
    const pdfPath = path.join(__dirname, '..', 'uploads', filename);

    try {
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
        try {
            await fs.promises.writeFile(newPdfPath, pdfBytes);
        } catch (error) {
            console.error("Error writing PDF file:", error);
            return res.status(500).json({ error: 'Failed to write the extracted PDF.' });
        }

        // Send download URL for the new PDF
        res.status(200).json({ downloadUrl: `http://localhost:5000/uploads/extracted.pdf` });
    } catch (error) {
        res.status(500).json({ error: 'Error extracting PDF: ' + error.message });
    }
};

module.exports = {
    uploadPdf,
    extractPages,
};
