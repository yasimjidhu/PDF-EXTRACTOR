import "./App.css";
import PDFUploader from "./components/PDFuploader";
import { PDFProvider } from "./context/PDFcontext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from "./components/ProtectedRoute";
import { NotFound } from "./pages/NotFound";
import Mypdfs from "./pages/MyPdfs";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <PDFProvider>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/upload" element={
              <ProtectedRoute>
                <PDFUploader />
              </ProtectedRoute>
            } /> 
            <Route path="/mypdfs" element={<Mypdfs/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </PDFProvider>
      </Router>
    </>
  );
}

export default App;
