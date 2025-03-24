'use client';
import React, { useState } from "react";
import { login } from "@/utils/authUtils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);

      setNotification({ show: true, message: "Login successful!", type: "success" });
      console.log("Logged in user:", user);

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
    } catch (err: any) {

      setNotification({ show: true, message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  return (
    <div className="max-w-md mx-auto my-60 p-6 bg-green-100 shadow-lg rounded-lg">

      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {notification.show && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            notification.type === "error"
              ? "bg-red-100 text-red-700 border-l-4 border-red-500"
              : "bg-green-100 text-green-700 border-l-4 border-green-500"
          } mb-4`}
        >
          <div className={`mr-3 ${notification.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {notification.type === "error" ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>{notification.message}</div>
          <button
            onClick={closeNotification}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleLogin}>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}