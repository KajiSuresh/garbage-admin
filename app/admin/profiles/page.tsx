"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  updateEmail,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc, getDoc, GeoPoint } from "firebase/firestore";
import Layout from "@/app/components/layout/Layout";
import { Toaster, toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserTag,
  FaUserShield,
} from "react-icons/fa";
import { MapIcon } from "lucide-react";
import { auth, db } from "../../../lib/firebase";

interface UserData {
  displayName: string;
  email: string;
  address: string;
  firstName: string;
  lastName: string;
  userName: string;
  userLevel: string;
  status: string;
  fcmToken?: string;
  location?: GeoPoint;
}

interface FormData extends UserData {
  password: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    email: "",
    address: "",
    firstName: "",
    lastName: "",
    userName: "",
    userLevel: "",
    status: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        setIsLoading(false);
        toast.error("Please login to view your profile");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const currentUser = auth.currentUser;
      const userEmail = currentUser ? currentUser.email : "";
      if (userDocSnapshot.exists()) {
        const userDataFromFirestore = userDocSnapshot.data() as UserData;
        setUserData(userDataFromFirestore);
        setFormData({
          displayName: userDataFromFirestore.displayName || "",
          email: userEmail || userDataFromFirestore.email || "",
          address: userDataFromFirestore.address || "",
          firstName: userDataFromFirestore.firstName || "",
          lastName: userDataFromFirestore.lastName || "",
          userName: userDataFromFirestore.userName || "",
          userLevel: userDataFromFirestore.userLevel || "",
          status: userDataFromFirestore.status || "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error("User profile data not found");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      toast.error(`Error loading profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.displayName.trim())
      newErrors.displayName = "Display name is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfileDetails = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user && !userId) {
        throw new Error("User not authenticated");
      }
      const uid = user ? user.uid : (userId as string);
      if (user) {
        await firebaseUpdateProfile(user, {
          displayName: formData.displayName,
        });
        if (formData.email !== user.email) {
          await updateEmail(user, formData.email);
        }
      }
      let currentLocation = userData?.location || new GeoPoint(0, 0);
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        email: formData.email,
        address: formData.address,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        status: formData.status,
        userLevel: userData?.userLevel || formData.userLevel,
        fcmToken: userData?.fcmToken,
        location: currentLocation,
      });
      setUserData({
        ...formData,
        fcmToken: userData?.fcmToken,
        location: userData?.location,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }
  
      await updatePassword(user, formData.password);
      
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please sign in again before changing your password");
      } else {
        toast.error(`Failed to update password: ${error.message}`);
      }
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Add the Toaster container */}
      <Toaster position="top-right" reverseOrder={false} />
      <Head>
        <title>My Profile | Garbage Collection System</title>
        <meta name="description" content="View and edit your profile details" />
      </Head>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="bg-white rounded-full p-2 shadow-lg mb-4 sm:mb-0 sm:mr-6">
                <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full w-24 h-24 flex items-center justify-center text-white text-4xl font-bold">
                  {userData?.firstName?.charAt(0)}
                  {userData?.lastName?.charAt(0)}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-white text-3xl sm:text-4xl font-bold">
                  {userData?.displayName || "User Profile"}
                </h1>
                <p className="text-purple-100 text-lg mt-1">
                  @{userData?.userName} • {userData?.userLevel}
                </p>
                <div className="mt-3 text-purple-200 flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="flex items-center">
                    <FaEnvelope className="mr-1" />
                    {userData?.email}
                  </span>
                  {userData?.status && (
                    <span className="flex items-center ml-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                      {userData.status === "" ? "Active" : userData.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("personal")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "personal"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } mr-8`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "security"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <div className="space-y-6">
                {isEditing ? (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2 text-purple-500" />
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.firstName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
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
                        <FaUser className="inline mr-2 text-purple-500" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.lastName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard className="inline mr-2 text-purple-500" />
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.displayName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                        }`}
                        placeholder="Enter display name"
                      />
                      {errors.displayName && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.displayName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUserTag className="inline mr-2 text-purple-500" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.userName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                        }`}
                        placeholder="Enter username"
                      />
                      {errors.userName && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.userName}
                        </p>
                      )}                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaEnvelope className="inline mr-2 text-purple-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                          }`}
                          placeholder="Enter email address"
                        />
                        {errors.email && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaUserShield className="inline mr-2 text-purple-500" />
                          User Level
                        </label>
                        <input
                          type="text"
                          name="userLevel"
                          value={formData.userLevel}
                          onChange={handleChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          placeholder="User level"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          User level cannot be changed by user
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaMapMarkerAlt className="inline mr-2 text-purple-500" />
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full p-3 border rounded-lg focus:ring-2 ${
                            errors.address
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                          }`}
                          placeholder="Enter your address"
                        />
                        {errors.address && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Active</option>
                          <option value="Away">Away</option>
                          <option value="Busy">Busy</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                      {userData?.location && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapIcon className="inline mr-2 h-4 w-4 text-purple-500" />
                            Location
                          </label>
                          <div className="text-gray-500 bg-gray-100 p-3 rounded-lg">
                            Latitude:{" "}
                            {userData.location?.latitude?.toFixed(6) || "N/A"},
                            Longitude:{" "}
                            {userData.location?.longitude?.toFixed(6) || "N/A"}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Location is updated automatically
                          </p>
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          First Name
                        </div>
                        <div className="text-gray-900">{userData?.firstName}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Last Name
                        </div>
                        <div className="text-gray-900">{userData?.lastName}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Display Name
                        </div>
                        <div className="text-gray-900">
                          {userData?.displayName}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Username
                        </div>
                        <div className="text-gray-900">{userData?.userName}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Email
                        </div>
                        <div className="text-gray-900">{userData?.email}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          User Level
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData?.userLevel === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {userData?.userLevel}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Address
                        </div>
                        <div className="text-gray-900">{userData?.address}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Status
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center`}>
                            <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                            {userData?.status === ""
                              ? "Active"
                              : userData?.status}
                          </span>
                        </div>
                      </div>
                      {userData?.location ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            Location
                          </div>
                          <div className="text-gray-900">
                            {userData.location?.latitude?.toFixed(6) || "N/A"},
                            {userData.location?.longitude?.toFixed(6) || "N/A"}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          For security reasons, changing your password requires
                          verification.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                        }`}
                        placeholder="Enter new password"
                      />
                      {errors.password && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 ${
                          errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                        }`}
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-red-500 text-xs">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      displayName: userData?.displayName || "",
                      email: userData?.email || "",
                      address: userData?.address || "",
                      firstName: userData?.firstName || "",
                      lastName: userData?.lastName || "",
                      userName: userData?.userName || "",
                      userLevel: userData?.userLevel || "",
                      status: userData?.status || "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfileDetails}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }