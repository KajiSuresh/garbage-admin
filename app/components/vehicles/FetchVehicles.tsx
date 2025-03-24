"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster
import Layout from "../../components/layout/Layout";
import { db } from "../../../utils/firebaseConfig";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const q = query(collection(db, "vehicles"));
        const querySnapshot = await getDocs(q);
        const vehiclesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(vehiclesData);
      } catch (error: any) {
        console.error("Error fetching vehicles:", error.message);
        toast.error(`Error fetching vehicles: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {

        const loadingToast = toast.loading("Deleting vehicle...");

        await deleteDoc(doc(db, "vehicles", vehicleId));
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));

        toast.dismiss(loadingToast);
        toast.success("Vehicle deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting vehicle:", error.message);
        toast.error(`Error deleting vehicle: ${error.message}`);
      }
    }
  };

  const handleSaveChanges = async (updatedData: any) => {
    try {
      setIsSubmitting(true);

      const loadingToast = toast.loading("Updating vehicle...");

      await updateDoc(doc(db, "vehicles", selectedVehicle.id), {
        ...updatedData,
        lastServiceDate:
          updatedData.lastServiceDate || selectedVehicle.lastServiceDate,
        updatedAt: serverTimestamp(),
      });

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === selectedVehicle.id ? { ...v, ...updatedData } : v
        )
      );

      toast.dismiss(loadingToast);
      toast.success("Vehicle updated successfully!");

      setIsEditing(false);
      setSelectedVehicle(null);
    } catch (error: any) {
      console.error("Error updating vehicle:", error.message);
      toast.error(`Error updating vehicle: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString().split("T")[0];
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-600">
          Manage Vehicles
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading vehicles...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Vehicle No</th>
                <th className="px-4 py-2 text-left">Condition</th>
                <th className="px-4 py-2 text-left">KM Done</th>
                <th className="px-4 py-2 text-left">Last Service Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="px-4 py-2">{v.vehicleNo}</td>
                    <td className="px-4 py-2">{v.condition}</td>
                    <td className="px-4 py-2">{v.kmDone}</td>
                    <td className="px-4 py-2">
                      {v.lastServiceDate
                        ? new Date(v.lastServiceDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">{v.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
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
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {isEditing && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedData = {
                    vehicleNo: formData.get("vehicleNo"),
                    condition: formData.get("condition"),
                    kmDone: parseInt(formData.get("kmDone") as string),
                    lastServiceDate: formData.get("lastServiceDate"),
                    status: formData.get("status"),
                  };
                  handleSaveChanges(updatedData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle No
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    defaultValue={selectedVehicle.vehicleNo}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <input
                    type="text"
                    name="condition"
                    defaultValue={selectedVehicle.condition}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Done
                  </label>
                  <input
                    type="number"
                    name="kmDone"
                    defaultValue={selectedVehicle.kmDone}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    name="lastServiceDate"
                    defaultValue={formatDate(selectedVehicle.lastServiceDate)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={selectedVehicle.status}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedVehicle(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
