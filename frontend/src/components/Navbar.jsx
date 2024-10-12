import React, { useState } from 'react';
import { FileText, User, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const user = useSelector((state)=>state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async ()=>{
    try {
      const response = await dispatch(logoutUser())
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText size={24} />
          <h1 className="text-xl font-bold">PDF Page Extractor</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-md px-3 py-2 text-sm font-medium"
          >
            <User size={20} />
            {/* <span>{username}</span> */}
            <ChevronDown size={20} className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
              <Link to='/mypdfs'>
                <p className='text-center text-black text-sm font-semibold space-x-2 p-3'>My Documents</p>
              </Link>
              <a 
                href="#logout" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center justify-center space-x-2 text-red-600" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;