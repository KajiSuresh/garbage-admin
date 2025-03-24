"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaClipboard,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaCarAlt,
  FaChevronRight,
} from "react-icons/fa";
import { FaNewspaper, FaPerson } from "react-icons/fa6";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = ({ isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Drivers", icon: <FaUsers />, path: "/admin/drivers" },
    { name: "Vehicles", icon: <FaCar />, path: "/admin/vehicles" },
    { name: "Rides", icon: <FaClipboard />, path: "/admin/rides" },
    { name: "News", icon: <FaNewspaper />, path: "/admin/news" },
    { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { name: "Profile", icon: <FaPerson />, path: "/admin/profiles" },
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <aside
      className={`bg-gradient-to-b from-gray-900 to-black text-white w-64 min-h-screen transition-all duration-300 ease-in-out shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-20`}
    >
      <div className="p-4 border-b border-gray-700">
       
        <span className="font-bold text-lg flex justify-center">
          Admin Panel
        </span>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => router.push(item.path)}
                className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-all duration-200 group
                  ${
                    isActive(item.path)
                      ? "bg-green-700 text-white font-medium shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-3 ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-green-500 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isActive(item.path) && (
                  <span className="text-xs">
                    <FaChevronRight />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button
          className="flex items-center w-full p-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
          onClick={() => {
            const auth = getAuth();
            signOut(auth)
              .then(() => {
                
                localStorage.removeItem("userSession");
                sessionStorage.clear();
                window.location.href = "/login";
              })
              .catch((error) => {
                console.error("Sign out error:", error);
              });
          }}
        >
          <span className="mr-3 text-red-500 group-hover:text-white">
            <FaSignOutAlt />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
