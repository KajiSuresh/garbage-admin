"use client";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-4 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">© {currentYear} SWCAdmin Dashboard. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;