"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import Layout from "@/app/components/layout/Layout";
import Drivers from "@/app/components/drivers/FetchDrivers";
import { Toaster, toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyCs8YqWU_YOu1Xms5yL3M-zQLHcrLPYFpM",
  authDomain: "garbagecollector-7bc51.firebaseapp.com",
  projectId: "garbagecollector-7bc51",
  storageBucket: "garbagecollector-7bc51.firebasestorage.app",
  messagingSenderId: "543646550751",
  appId: "1:543646550751:web:4c1fc3b34b44986993f76a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface Driver {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  location?: string;
  userName?: string;
  userLevel?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export default function AddDriverPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    location: "",
    userName: "",
  });

  interface FormErrors {
    [key: string]: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [driversUpdated, setDriversUpdated] = useState(false);
  
  const triggerDriversRefresh = () => {
    setDriversUpdated(prev => !prev);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        showNotification(
          "Geolocation is not supported by your browser",
          "error"
        );
        toast.error("Geolocation is not supported by your browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const formattedAddress =
                result.formatted || "Address not available";
              setFormData((prev) => ({
                ...prev,
                location: formattedAddress,
              }));
              toast.success("Location found successfully");
            }
          } catch (error: any) {
            showNotification(
              `Error fetching address: ${error.message}`,
              "error"
            );
            toast.error(`Error fetching address: ${error.message}`);
          }
        },
        () => {
          showNotification("Unable to retrieve your location", "error");
          toast.error("Unable to retrieve your location");
        }
      );
    } catch (error: any) {
      showNotification(`Error: ${error.message}`, "error");
      toast.error(`Error: ${error.message}`);
    }
  };

  const showNotification = (message: string, type: string = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    const loadingToastId = toast.loading("Adding driver...");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
  
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        location: formData.location,
        userName: formData.userName,
        userLevel: "Driver",
        status: "",
        createdAt: new Date().toISOString(),
      });
  
      toast.success("Driver added successfully!", { id: loadingToastId });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        location: "",
        userName: "",
      });
  
      triggerDriversRefresh();
  
      setTimeout(() => {
        router.push("/admin/drivers");
      }, 2000);
  
    } catch (error: any) {
      let errorMessage = "Failed to add driver";
      if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already exists";
      }
      
      toast.error(errorMessage, { id: loadingToastId });
      
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Add Driver | Garbage Collection System</title>
        <meta
          name="description"
          content="Add a new driver to the garbage collection system"
        />
      </Head>
      
      {/* Toast Container */}
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 sm:p-6">
            <h1 className="text-white text-xl sm:text-2xl font-bold text-center">
              Add Driver
            </h1>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            {notification.show && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  notification.type === "error"
                    ? "bg-red-500 bg-opacity-20 text-red-300"
                    : "bg-green-500 bg-opacity-20 text-green-300"
                }`}
              >
                {notification.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500 focus:border-transparent"
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500 focus:border-transparent"
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500 focus:border-transparent"
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-green-500 focus:border-transparent"
                      }`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                      errors.address
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500 focus:border-transparent"
                    }`}
                    placeholder="Enter address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                        errors.location
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-green-500 focus:border-transparent"
                      }`}
                      placeholder="Enter location"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                    errors.userName
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-500 focus:border-transparent"
                  }`}
                  placeholder="Choose username"
                />
                {errors.userName && (
                  <p className="mt-1 text-red-500 text-xs">{errors.userName}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-lg transition duration-200 ${
                  isLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>ADDING DRIVER...</span>
                  </div>
                ) : (
                  "ADD DRIVER"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-300"
                >
                  Go back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Pass the refresh trigger to Drivers component */}
      <Drivers refreshTrigger={driversUpdated} />
    </Layout>
  );
}