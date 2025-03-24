
"use client";
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import AuthWrapper from "../AuthWrapper";
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthWrapper>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AuthWrapper>
  );
};

export default Layout;