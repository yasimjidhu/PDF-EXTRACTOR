import { useContext, useEffect } from "react";
import { PDFcontext } from "../context/PDFcontext";
import { getDocument } from "pdfjs-dist";

export const usePDF = () => {
    const {
        pdfFile,
        setPageCount,
        selectedPages,
        setSelectedPages
    } = useContext(PDFcontext)

    useEffect(() => {
        const renderPDF = async (file) => {
            const loadingTask = getDocument(URL.createObjectURL(file));
            const pdf = await loadingTask.promise;
            setPageCount(pdf.numPages)
        };

        if (pdfFile) {
            renderPDF(pdfFile)
        }
    }, [pdfFile, setPageCount])

    const togglePageSelection = (page) => {
        setSelectedPages((prev) =>
            prev.includes(page)
                ? prev.filter((p) => p !== page)
                : [...prev,page]
        )
    };

    return {togglePageSelection}
}