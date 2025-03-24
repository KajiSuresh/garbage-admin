"use client";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  GeoPoint,
  serverTimestamp,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/layout/Layout";
import { Toaster, toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyCs8YqWU_YOu1Xms5yL3M-zQLHcrLPYFpM",
  authDomain: "garbagecollector-7bc51.firebaseapp.com",
  projectId: "garbagecollector-7bc51",
  storageBucket: "garbagecollector-7bc51.firebasestorage.app",
  messagingSenderId: "543646550751",
  appId: "1:543646550751:web:4c1fc3b34b44986993f76a",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};
const center = {
  lat: 9.7115,
  lng: 80.1255,
};

export default function ManageRides() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [isAddingRide, setIsAddingRide] = useState(false);
  const [rideTime, setRideTime] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAW8glLcOYyjtJUvHS6fVNlsVuqKO5lNpQ",
  });

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const q = query(collection(db, "rides"));
        const querySnapshot = await getDocs(q);
        const ridesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRides(ridesData);
      } catch (error: any) {
        console.error("Error fetching rides:", error.message);
        toast.error(`Error fetching rides: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("userLevel", "==", "Driver")
        );
        const querySnapshot = await getDocs(q);
        const driversData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().userName,
        }));
        setDrivers(driversData);
      } catch (error: any) {
        console.error("Error fetching drivers:", error.message);
        toast.error(`Error fetching drivers: ${error.message}`);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const q = query(
          collection(db, "vehicles"),
          where("status", "==", "Available")
        );
        const querySnapshot = await getDocs(q);
        const vehicleNumbers = querySnapshot.docs.map(
          (doc) => doc.data().vehicleNo as string
        );
        setVehicles(vehicleNumbers);
      } catch (error: any) {
        console.error("Error fetching vehicles:", error.message);
        toast.error(`Error fetching vehicles: ${error.message}`);
      }
    };
    fetchVehicles();
  }, []);

  const handleDeleteRide = async (rideId: string) => {
    if (confirm("Are you sure you want to delete this ride?")) {
      try {
        await deleteDoc(doc(db, "rides", rideId));
        setRides((prev) => prev.filter((r) => r.id !== rideId));
        toast.success("Ride deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting ride:", error.message);
        toast.error(`Error deleting ride: ${error.message}`);
      }
    }
  };

  const saveRideDetails = async () => {
    if (!selectedDriver || !selectedVehicle || markers.length !== 2 || !rideTime) {
      toast.error("Please fill all fields, select two markers on the map, and set a ride time.");
      return;
    }

    const confirmAssignment = confirm(
      "Are you sure you want to assign this ride? The driver and user will be notified immediately."
    );
    if (!confirmAssignment) {
      return; 
    }

    setIsAddingRide(true);

    try {
    
      const rideRef = await addDoc(collection(db, "rides"), {
        driverId: selectedDriver,
        vehicleNo: selectedVehicle,
        startLocation: new GeoPoint(markers[0].lat, markers[0].lng),
        endLocation: new GeoPoint(markers[1].lat, markers[1].lng),
        status: "Assigned",
        rideTime: rideTime,
        timestamp: serverTimestamp(),
      });

      const driverDoc = await getDoc(doc(db, "users", selectedDriver));
      const driverName = driverDoc.exists() ? driverDoc.data().userName : "Unknown Driver";

      const driverNotificationMessage = `Dear ${driverName}, a new ride has been assigned to you at ${rideTime}. Please get ready and ensure your vehicle (${selectedVehicle}) is prepared for the trip.`;

      await addDoc(collection(db, "notifications"), {
        userId: selectedDriver, 
        message: driverNotificationMessage,
        rideId: rideRef.id,
        notificationType: "driver",
        timestamp: serverTimestamp(),
        read: false,
      });

      const userDoc = await getDoc(doc(db, "users", "currentUserUid"));
      const userName = userDoc.exists() ? userDoc.data().userName : "User";

      const userNotificationMessage = `Dear ${userName}, your ride has been successfully assigned to ${driverName} at ${rideTime}. Please ensure you are ready at the pickup location.`;

      await addDoc(collection(db, "notifications"), {
        userId: "currentUserUid", 
        message: userNotificationMessage,
        rideId: rideRef.id,
        notificationType: "user",
        timestamp: serverTimestamp(),
        read: false, 
      });

      toast.success("Ride assigned successfully! Both the driver and user have been notified.");
      setMarkers([]);
      setSelectedDriver(null);
      setSelectedVehicle(null);
      setRideTime(""); 
      router.push("/admin/rides");
    } catch (error: any) {
      console.error("Error assigning ride:", error.message);
      toast.error(`Error assigning ride: ${error.message}`);
    } finally {
      setIsAddingRide(false);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (markers.length < 2 && event.latLng) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkers([...markers, newMarker]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Layout>

      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Add New Ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                {drivers.length > 0 ? (
                  <select
                    value={selectedDriver || ""}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((driverData) => (
                      <option key={driverData.id} value={driverData.id}>
                        {driverData.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500">No drivers available</p>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vehicle
                </label>
                {vehicles.length > 0 ? (
                  <select
                    value={selectedVehicle || ""}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500">No vehicles available</p>
                )}
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Ride Time
              </label>
              <input
                type="datetime-local"
                value={rideTime}
                onChange={(e) => setRideTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pickup and Dropoff Locations (Click on map to add
                markers)
              </label>
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  onClick={handleMapClick}
                  onLoad={onMapLoad}
                >
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker}
                      label={index === 0 ? "A" : "B"}
                      icon={{
                        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${
                          index === 0 ? "green" : "red"
                        }" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><text x="50%" y="55%" font-size="12" text-anchor="middle" fill="white" font-weight="bold" dominant-baseline="middle">${
                          index === 0 ? "A" : "B"
                        }</text></svg>`,
                        scaledSize: new google.maps.Size(40, 40),
                      }}
                    />
                  ))}
                </GoogleMap>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pickup Location</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Dropoff Location
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={saveRideDetails}
              disabled={
                isAddingRide ||
                !selectedDriver ||
                !selectedVehicle ||
                markers.length !== 2 ||
                !rideTime
              }
              className={`w-full mt-4 py-4 text-white font-bold rounded-lg transition duration-200 ${
                isAddingRide ||
                !selectedDriver ||
                !selectedVehicle ||
                markers.length !== 2 ||
                !rideTime
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isAddingRide ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Assigning Ride...</span>
                </div>
              ) : (
                "ASSIGN RIDE"
              )}
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 sm:p-6">
              <h1 className="text-white text-xl sm:text-2xl font-bold text-center">
                Manage Rides
              </h1>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {loading ? (
                <p className="text-center text-gray-500">Loading rides...</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Driver</th>
                      <th className="px-4 py-2 text-left">Vehicle</th>
                      <th className="px-4 py-2 text-left">Pickup Location</th>
                      <th className="px-4 py-2 text-left">Dropoff Location</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.length > 0 ? (
                      rides.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="px-4 py-2">{r.driverId}</td>
                          <td className="px-4 py-2">{r.vehicleNo}</td>
                          <td className="px-4 py-2">
                            {`${r.startLocation.latitude}, ${r.startLocation.longitude}`}
                          </td>
                          <td className="px-4 py-2">
                            {`${r.endLocation.latitude}, ${r.endLocation.longitude}`}
                          </td>
                          <td className="px-4 py-2">{r.status}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteRide(r.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No rides found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}