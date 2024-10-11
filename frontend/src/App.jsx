import "./App.css";
import Header from "./components/Navbar";
import PDFUploader from "./components/PDFuploader";
import { PDFProvider } from "./context/PDFcontext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <PDFProvider>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/upload" element={<PDFUploader />} /> 
          </Routes>
        </PDFProvider>
      </Router>
    </>
  );
}

export default App;
