import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getMyPdfs } from '../redux/pdfSlice';

const Mypdfs = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {user} = useSelector((state)=>state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        console.log('user iss',user)
        const response = await dispatch(getMyPdfs(user._id))
        console.log('response ofd my pdfs infortend',response)
        setPdfs(response.payload);
      } catch (err) {
        setError('Failed to load PDFs');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [user,dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Your Extracted PDFs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pdfs.map((pdf, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-md">
              <h2 className="text-lg font-semibold">{pdf.filename}</h2>
              <p className="text-sm text-gray-600">
                Pages: {pdf.pages.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Uploaded on: {new Date(pdf.createdAt).toLocaleDateString()}
              </p>
              <a
                href={`http://localhost:5000/uploads/${pdf.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Mypdfs;
