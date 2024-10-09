import React,{useEffect,useRef} from "react";
import { getDocument } from "pdfjs-dist";

const PDFpage = ({pageNumber,isSelected,onToggle})=>{
    const canvasRef = useRef(null)

    useEffect(()=>{
        const renderPage = async ()=>{
            const loadingTask = getDocument()
            const pdf = await loadingTask.promise
            const page = await pdf.getPage(pageNumber)
            const viewPort = page.getViewport({scale:1})

            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            canvas.height = viewPort.height
            canvas.width = viewPort.width

            const renderContext = {
                canvasContext:context,
                viewPort:viewPort
            }
            await page.render(renderContext).promise
        }

        renderPage()
    },[pageNumber])

    return (
        <div>
            <input type="checkbox" 
            checked={isSelected}
            onChange={ontoggle}
            className="mr-2"
            />
            <canvas ref={canvasRef} className="border rounded"/>
        </div>
    )
}

export default PDFpage