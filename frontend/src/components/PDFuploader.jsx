import React, { useContext, useEffect, useState } from "react";
import { PDFcontext } from "../context/PDFcontext";
import PageSelector from "./PageSelector";
import { FileUp, FileText, Check } from "lucide-react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { extractPdfPages, uploadPdf } from "../redux/pdfSlice";

const PDFUploader = () => {
  const { pdfFile, setPdfFile, selectedPages } = useContext(PDFcontext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    document.title = 'Upload'
  },[])

  const {user} = useSelector((state)=>state.auth)

  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError("Please upload a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);

    if(!user)return;

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      const uploadResponse = await dispatch(uploadPdf(formData)).unwrap();

      const filename = uploadResponse.filename;

      // Now, extract the selected pages from the uploaded PDF
      const extractResponse = await dispatch(
        extractPdfPages({ filename, selectedPages,user })
      ).unwrap();

      const link = document.createElement("a");
      link.href = extractResponse.downloadUrl;
      link.download = "extracted.pdf";
      link.click();
    } catch (error) {
      console.error("Error processing PDF:", error);
      setError("An error occurred while processing the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
        {/* Left side image section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-white flex flex-col justify-center items-center">
          <FileText size={120} className="mb-8 text-white opacity-75" />
          <h2 className="text-3xl font-bold mb-4 text-center">
            PDF Page Selector
          </h2>
          <p className="text-lg text-center opacity-75">
            Upload your PDF and select the pages you want to include in your new
            document.
          </p>
        </div>

        {/* Right side form section */}
        <div className="md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Upload PDF
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {pdfFile && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Selected PDF:</h3>
                <p className="text-sm text-gray-600">{pdfFile.name}</p>
              </div>
            )}

            {pdfFile && <PageSelector pdfFile={pdfFile} />}

            <button
              type="submit"
              disabled={loading || !pdfFile || selectedPages.length === 0}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || !pdfFile || selectedPages.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating PDF...
                </>
              ) : (
                <>
                  <Check className="mr-2" size={18} />
                  Create PDF
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PDFUploader;
