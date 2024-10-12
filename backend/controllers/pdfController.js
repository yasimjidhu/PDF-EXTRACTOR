const fs = require('fs');
const path = require('path');
const User = require('../model/user')
const { PDFDocument } = require('pdf-lib');
const mongoose = require('mongoose')

const uploadPdf = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

const extractPages = async (req, res) => {
    const { selectedPages, filename, user } = req.body;
    const pdfPath = path.join(__dirname, '..', 'uploads', filename);
    
    try {
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Read the existing PDF
        const existingPdfBytes = await fs.promises.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdfDoc = await PDFDocument.create();

        const pageCount = pdfDoc.getPageCount();
        
        // Validate selectedPages and copy valid pages
        for (const pageIndex of selectedPages) {
            // Ensure zero-based index and valid page numbers
            if (pageIndex >= 1 && pageIndex <= pageCount) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex - 1]); // Convert to zero-index
                newPdfDoc.addPage(copiedPage);
            } else {
                return res.status(400).json({ error: `Invalid page number: ${pageIndex}` });
            }
        }

        // Generate a unique filename for the extracted PDF
        const extractedFilename = `extracted_${Date.now()}.pdf`;
        const newPdfPath = path.join(__dirname, '..', 'uploads', extractedFilename);

        // Save the new PDF
        const pdfBytes = await newPdfDoc.save();
        await fs.promises.writeFile(newPdfPath, pdfBytes);

        // Update the user's pdfs field in MongoDB
        const userId = mongoose.Types.ObjectId.isValid(user._id)
            ? new mongoose.Types.ObjectId(user._id)
            : user._id;

        const UserFound = await User.findOne({ _id: userId });
        if (!UserFound) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add PDF info to the user's pdfs array
        UserFound.pdfs.push({
            filename: extractedFilename, // Save extracted filename here
            pages: selectedPages,
            createdAt: new Date()
        });

        // Save the updated user document
        await UserFound.save();

        // Send download URL for the new PDF
        res.status(200).json({
            message: 'PDF extracted and saved',
            downloadUrl: `http://localhost:10000/uploads/${extractedFilename}` // Use dynamic filename
        });
    } catch (error) {
        res.status(500).json({ error: 'Error extracting PDF: ' + error.message });
    }
};


const getMyPdfs = async(req,res)=>{
    try {
        console.log('requesr reached in getmypdfs',req.params.userId)
        const userId = mongoose.Types.ObjectId.isValid(req.params.userId)
          ? new mongoose.Types.ObjectId(req.params.userId)
          : null;
    
        if (!userId) {
          return res.status(400).json({ error: 'Invalid user ID' });
        }
    
        const user = await User.findOne({ _id: userId }).select('pdfs');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(user.pdfs);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
}

module.exports = {
    uploadPdf,
    extractPages,
    getMyPdfs,
};
