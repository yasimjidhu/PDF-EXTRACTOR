import React, { useContext, useState } from 'react';
import axios from 'axios';
import { PDFcontext } from '../context/PDFcontext';
import PageSelector from './PageSelector';

const PDFUploader = () => {
  const { pdfFile, setPdfFile, selectedPages } = useContext(PDFcontext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError('Please upload a valid PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      const uploadResponse = await axios.post('http://localhost:5000/upload', formData);
      
      const extractResponse = await axios.post('http://localhost:5000/upload/extract', {
        filename: uploadResponse.data.filename,
        selectedPages,
      });

      const link = document.createElement('a');
      link.href = extractResponse.data.downloadUrl;
      link.download = 'extracted.pdf';
      link.click();
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('An error occurred while processing the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {pdfFile && <PageSelector pdfFile={pdfFile} />}
        <button
          type="submit"
          disabled={loading || !pdfFile || selectedPages.length === 0}
          className={`w-full p-2 mt-4 text-white font-bold rounded ${
            loading || !pdfFile || selectedPages.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating PDF...' : 'Create PDF'}
        </button>
      </form>
    </div>
  );
};

export default PDFUploader;