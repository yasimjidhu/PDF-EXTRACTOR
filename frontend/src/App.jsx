import "./App.css";
import Header from "./components/Header";
import PDFUploader from "./components/PDFuploader";
import { PDFProvider } from "./context/PDFcontext";

function App() {
  return (
    <>
      <PDFProvider>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PDFUploader />
          </main>
        </div>
      </PDFProvider>
    </>
  );
}

export default App;
