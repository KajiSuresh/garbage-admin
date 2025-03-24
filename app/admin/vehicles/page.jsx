"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast"; 
import Layout from "../../components/layout/Layout";
import { db } from "../../../lib/firebase";
import Vehicles from "../../components/vehicles/FetchVehicles";

export default function VehicleForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [condition, setCondition] = useState("");
  const [kmDone, setKmDone] = useState("");
  const [lastServiceDate, setLastServiceDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addDoc(collection(db, "vehicles"), {
        vehicleNo: vehicleNo.trim(),
        condition: condition.trim(),
        kmDone: parseInt(kmDone.trim()),
        lastServiceDate: lastServiceDate.trim(),
        status: "Available",
        createdAt: serverTimestamp(),
      });

      toast.success("Vehicle details saved successfully!");

      setVehicleNo("");
      setCondition("");
      setKmDone("");
      setLastServiceDate("");
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error(`Error saving vehicle details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Add Toaster component */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mb-4">
        <h2 className="text-2xl font-bold mb-6 text-green-600">
          Create Vehicle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle No
            </label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KM Done
            </label>
            <input
              type="number"
              value={kmDone}
              onChange={(e) => setKmDone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Service Date
            </label>
            <input
              type="date"
              value={lastServiceDate}
              onChange={(e) => setLastServiceDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-70"
          >
            {loading ? "Saving..." : "SAVE VEHICLE DETAILS"}
          </button>
        </form>
      </div>
      <Vehicles />
    </Layout>
  );
}