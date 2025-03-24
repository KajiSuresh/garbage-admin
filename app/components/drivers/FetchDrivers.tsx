"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCs8YqWU_YOu1Xms5yL3M-zQLHcrLPYFpM",
  authDomain: "garbagecollector-7bc51.firebaseapp.com",
  projectId: "garbagecollector-7bc51",
  storageBucket: "garbagecollector-7bc51.firebasestorage.app",
  messagingSenderId: "543646550751",
  appId: "1:543646550751:web:4c1fc3b34b44986993f76a"
};

interface DriversProps {
  refreshTrigger?: boolean;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Drivers({ refreshTrigger }: DriversProps){
  const router = useRouter();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "users"),
          where("userLevel", "==", "Driver")
        );
        const querySnapshot = await getDocs(q);
        const driversData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrivers(driversData);
      } catch (error: any) {
        console.error("Error fetching drivers:", error.message);
        toast.error(`Failed to load drivers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
  }, [db]); 

  const handleEdit = (driver: any) => {
    setSelectedDriver(driver);
    setIsEditing(true);
  };

  const handleDelete = async (driverId: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {

      const loadingToastId = toast.loading("Deleting driver...");
      
      try {
        await deleteDoc(doc(db, "users", driverId));
        setDrivers((prev) => prev.filter((driver) => driver.id !== driverId));

        toast.success("Driver deleted successfully!", { id: loadingToastId });
      } catch (error: any) {
        console.error("Error deleting driver:", error.message);

        toast.error(`Failed to delete driver: ${error.message}`, { id: loadingToastId });
      }
    }
  };

  const handleSaveChanges = async (updatedData: any) => {

    const loadingToastId = toast.loading("Updating driver information...");
    
    try {
      await updateDoc(doc(db, "users", selectedDriver.id), updatedData);
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === selectedDriver.id
            ? { ...driver, ...updatedData }
            : driver
        )
      );
      setIsEditing(false);
      setSelectedDriver(null);

      toast.success("Driver updated successfully!", { id: loadingToastId });
    } catch (error: any) {
      console.error("Error updating driver:", error.message);

      toast.error(`Failed to update driver: ${error.message}`, { id: loadingToastId });
    }
  };

  return (
    <>
      <Head>
        <title>View Drivers | Garbage Collection System</title>
        <meta name="description" content="View and manage drivers" />
      </Head>

      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 sm:p-6">
            <h1 className="text-white text-xl sm:text-2xl font-bold text-center">
              View Drivers
            </h1>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                <p className="ml-2 text-gray-500">Loading drivers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Address</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.length > 0 ? (
                      drivers.map((driver) => (
                        <tr key={driver.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {driver.firstName} {driver.lastName}
                          </td>
                          <td className="px-4 py-2">{driver.email}</td>
                          <td className="px-4 py-2">{driver.address}</td>
                          <td className="px-4 py-2">
                            {typeof driver.location === 'string' 
                              ? driver.location 
                              : `${driver.location?.latitude || 'N/A'}, ${driver.location?.longitude || 'N/A'}`}
                          </td>
                          <td className="px-4 py-2">{driver.userName}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              onClick={() => handleEdit(driver)}
                              className="px-3 py-1 text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(driver.id)}
                              className="px-3 py-1 text-red-500 hover:text-red-700 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No drivers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {isEditing && selectedDriver && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                  <h2 className="text-xl font-bold mb-4">Edit Driver</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      
                      let locationData;
                      if (typeof selectedDriver.location === 'string') {
                        locationData = formData.get("location");
                      } else {
                        locationData = {
                          latitude: parseFloat(formData.get("latitude") as string || "0"),
                          longitude: parseFloat(formData.get("longitude") as string || "0"),
                        };
                      }
                      
                      const updatedData = {
                        firstName: formData.get("firstName"),
                        lastName: formData.get("lastName"),
                        email: formData.get("email"),
                        address: formData.get("address"),
                        location: locationData,
                        userName: formData.get("userName"),
                      };
                      handleSaveChanges(updatedData);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        defaultValue={selectedDriver.firstName}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        defaultValue={selectedDriver.lastName}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={selectedDriver.email}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        defaultValue={selectedDriver.address}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    {typeof selectedDriver.location === 'string' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          defaultValue={selectedDriver.location}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="latitude"
                            defaultValue={selectedDriver.location?.latitude || ""}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="longitude"
                            defaultValue={selectedDriver.location?.longitude || ""}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="userName"
                        defaultValue={selectedDriver.userName}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedDriver(null);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}