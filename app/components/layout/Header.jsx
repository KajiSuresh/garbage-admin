"use client";

import { FaBell, FaUserCircle, FaCarAlt } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-2 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-full mr-2">
                <FaCarAlt className="text-2xl text-green-700" />
              </div>
              <span className="text-xl font-bold tracking-wider">SWCAdmin</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                <FaBell className="text-lg" />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 border-l pl-4 border-green-500">
              <div className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center shadow-md">
                <FaUserCircle className="text-2xl" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold">Admin User</div>
                <div className="text-xs text-green-200">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;