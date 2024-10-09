import React, { useContext, useEffect } from 'react';
import { PDFcontext } from '../context/PDFcontext';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PageSelector = () => {
  const { pdfFile, selectedPages, setSelectedPages, totalPages, setTotalPages } = useContext(PDFcontext);

  useEffect(() => {
    setSelectedPages([]);
  }, [pdfFile, setSelectedPages]);

  const togglePage = (pageNumber) => {
    setSelectedPages(prev => 
      prev.includes(pageNumber)
        ? prev.filter(p => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select pages to extract:</h3>
      <Document
        file={pdfFile}
        onLoadSuccess={handleDocumentLoadSuccess}
        className="flex flex-wrap justify-center"
      >
        {Array.from(new Array(totalPages), (el, index) => (
          <div key={`page_${index + 1}`} className="m-2">
            <label className="flex flex-col items-center">
              <Page
                pageNumber={index + 1}
                width={100}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              <input
                type="checkbox"
                checked={selectedPages.includes(index + 1)}
                onChange={() => togglePage(index + 1)}
                className="mt-1"
              />
              <span className="text-sm">Page {index + 1}</span>
            </label>
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PageSelector;