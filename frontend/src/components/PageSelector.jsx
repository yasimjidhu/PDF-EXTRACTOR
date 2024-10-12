import React, { useContext, useEffect, useState } from 'react';
import { PDFcontext } from '../context/PDFcontext';
import { getDocument } from 'pdfjs-dist/build/pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const PageSelector = () => {
  const { pdfFile, selectedPages, setSelectedPages, setPageCount } = useContext(PDFcontext);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [error, setError] = useState(null);
  const [renderedPages, setRenderedPages] = useState([]);

  useEffect(() => {
    setSelectedPages([]);
    setError(null);
    setRenderedPages([]);

    if (pdfFile) {
      const loadPdf = async () => {
        try {
          const arrayBuffer = await pdfFile.arrayBuffer();
          const pdf = await getDocument({ data: arrayBuffer }).promise;
          setPdfDocument(pdf);
          setPageCount(pdf.numPages);
        } catch (err) {
          console.error('Error loading PDF:', err);
          setError('Failed to load the PDF. Please try uploading the file again.');
        }
      };
      loadPdf();
    }
  }, [pdfFile, setSelectedPages, setPageCount]);

  useEffect(() => {
    if (pdfDocument) {
      const renderPages = async () => {
        const pages = [];
        try {
          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pages.push(canvas.toDataURL());
          }
          setRenderedPages(pages);
        } catch (err) {
          console.error('Error rendering pages:', err);
          setError('Failed to render PDF pages. Please try again.');
        }
      };
      renderPages();
    }
  }, [pdfDocument]);

  const togglePage = (pageNumber) => {
    setSelectedPages(prev => 
      prev.includes(pageNumber)
        ? prev.filter(p => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  if (!pdfFile) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select pages to extract:</h3>
      <div className="flex flex-wrap justify-center">
        {renderedPages.map((pageDataUrl, index) => (
          <div key={`page_${index + 1}`} className="m-2">
            <label className="flex flex-col items-center">
              <img src={pageDataUrl} alt={`Page ${index + 1}`} className="w-24 h-auto" />
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
      </div>
    </div>
  );
};

export default PageSelector;
