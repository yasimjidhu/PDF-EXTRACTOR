import React, { createContext, useState } from "react";

export const PDFcontext = createContext();

export const PDFProvider = ({ children }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);

  return (
    <PDFcontext.Provider
      value={{
        pdfFile,
        setPdfFile,
        pageCount,
        setPageCount,
        selectedPages,
        setSelectedPages,
      }}
    >
      {children}
    </PDFcontext.Provider>
  );
};
