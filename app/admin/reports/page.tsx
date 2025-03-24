"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { utils as XLSXUtils, write as XLSXWrite } from "xlsx";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import Layout from "@/app/components/layout/Layout";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userLevel: string;
  status: string;
  address: string;
}

interface Vehicle {
  id: string;
  vehicleNo: string;
  condition: string;
  kmDone: number;
  lastServiceDate: Timestamp;
  status: string;
}

interface Ride {
  id: string;
  driverId: string;
  vehicleNo: string;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
  status: string;
  timestamp: Timestamp;
}

interface GarbageCategory {
  id: string;
  rideId: string;
  categories: string[];
  timestamp: Timestamp;
}

type ReportType = "rides" | "users" | "vehicles" | "garbageCategories" | "all";

export default function ReportsPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [garbageCategories, setGarbageCategories] = useState<GarbageCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ReportType>("all");
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {

      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
      setUsers(usersData);

      const userMapping: Record<string, string> = {};
      usersData.forEach((user) => {
        userMapping[user.id] = `${user.firstName} ${user.lastName}`;
      });
      setUserMap(userMapping);

      const vehiclesQuery = query(collection(db, "vehicles"));
      const vehiclesSnapshot = await getDocs(vehiclesQuery);
      const vehiclesData = vehiclesSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Vehicle)
      );
      setVehicles(vehiclesData);

      const ridesQuery = query(collection(db, "rides"));
      const ridesSnapshot = await getDocs(ridesQuery);
      const ridesData = ridesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          driverId: data.driverId,
          vehicleNo: data.vehicleNo,
          startLocation: {
            latitude: data.startLocation?.latitude || 0,
            longitude: data.startLocation?.longitude || 0,
          },
          endLocation: {
            latitude: data.endLocation?.latitude || 0,
            longitude: data.endLocation?.longitude || 0,
          },
          status: data.status,
          timestamp: data.timestamp,
        } as Ride;
      });
      setRides(ridesData);

      const garbageCategoriesQuery = query(collection(db, "garbageCategories"));
      const garbageCategoriesSnapshot = await getDocs(garbageCategoriesQuery);
      const garbageCategoriesData = garbageCategoriesSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            rideId: data.rideId,
            categories: Array.isArray(data.categories) ? data.categories : [],
            timestamp: data.timestamp,
          } as GarbageCategory;
        }
      );
      setGarbageCategories(garbageCategoriesData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getReportData = () => {
    switch (selectedType) {
      case "rides":
        return rides.map((ride) => ({
          ID: ride.id,
          Driver: userMap[ride.driverId] || ride.driverId,
          Vehicle: ride.vehicleNo,
          "Start Location": `${ride.startLocation?.latitude.toFixed(
            6
          )}°, ${ride.startLocation?.longitude.toFixed(6)}°`,
          "End Location": `${ride.endLocation?.latitude.toFixed(
            6
          )}°, ${ride.endLocation?.longitude.toFixed(6)}°`,
          Status: ride.status,
          Date: ride.timestamp
            ? format(ride.timestamp.toDate(), "PPP p")
            : "N/A",
        }));
  
      case "users":
        return users.map((user) => ({
          ID: user.id,
          Name: `${user.firstName} ${user.lastName}`,
          Email: user.email,
          Role: user.userLevel,
          Status: user.status || "Active",
          Address: user.address,
        }));
  
      case "vehicles":
        return vehicles.map((vehicle) => ({
          ID: vehicle.id,
          "Vehicle Number": vehicle.vehicleNo,
          Condition: vehicle.condition,
          "KM Done": vehicle.kmDone,
          "Last Service": getFormattedDate(vehicle.lastServiceDate),
          Status: vehicle.status,
        }));
  
      case "garbageCategories":
        return garbageCategories.map((gc) => ({
          ID: gc.id,
          "Ride ID": gc.rideId,
          Categories: gc.categories.join(", "),
          Date: getFormattedDate(gc.timestamp),
        }));
  
      case "all":
      default:
        return [
          {
            Category: "Rides",
            Total: rides.length,
            Active: rides.filter((r) => r.status === "Assigned").length,
          },
          {
            Category: "Users",
            Total: users.length,
            Admins: users.filter((u) => u.userLevel === "Admin").length,
          },
          {
            Category: "Vehicles",
            Total: vehicles.length,
            Available: vehicles.filter((v) => v.status === "Available").length,
          },
          {
            Category: "Garbage Categories",
            Total: garbageCategories.length,
          },
        ];
    }
  };
  
  function getFormattedDate(dateValue: string | number | Timestamp | Date) {
    if (!dateValue) return "N/A";
  
    try {

      if (dateValue instanceof Timestamp && typeof dateValue.toDate === "function") {
        return format(dateValue.toDate(), "PPP p");
      }

      if (typeof dateValue === "string") {
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
          return format(parsedDate, "PPP p");
        }
      }

      if (dateValue instanceof Date) {
        return format(dateValue, "PPP p");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  
    return "N/A";
  }

  const exportToExcel = () => {
    const data = getReportData();
    if (!data.length) return;
    const ws = XLSXUtils.json_to_sheet(data);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, `${selectedType} Report`);
    const excelBuffer = XLSXWrite(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedType}-report.xlsx`;
    link.click();
  };

  const exportToPDF = () => {
    const data = getReportData();
    if (!data.length) return;
    const doc = new jsPDF();
    const title = `${
      selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
    } Report`;
    doc.text(title, 14, 16);
    const keys = Object.keys(data[0]);
    doc.autoTable({
      startY: 20,
      head: [keys],
      body: data.map((row) =>
        keys.map((key) => (row as Record<string, any>)[key])
      ),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save(`${selectedType}-report.pdf`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const reportData = getReportData();

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600">
            View and export data from rides, users, vehicles, and garbage
            categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">Total Rides</div>
            <div className="text-2xl font-bold">{rides.length}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Total Users</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
            <div className="text-gray-500 text-sm">Total Vehicles</div>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-orange-500">
            <div className="text-gray-500 text-sm">Total Garbage Records</div>
            <div className="text-2xl font-bold">{garbageCategories.length}</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              {selectedType === "all"
                ? "Summary Report"
                : `${
                    selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
                  } Report`}
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ReportType)}
              >
                <option value="all">All Reports</option>
                <option value="rides">Rides</option>
                <option value="users">Users</option>
                <option value="vehicles">Vehicles</option>
                <option value="garbageCategories">Garbage Categories</option>
              </select>
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Excel
              </button>
              {reportData.length > 0 && (
                <CSVLink
                  data={reportData}
                  filename={`${selectedType}-report.csv`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  CSV
                </CSVLink>
              )}
              <button
                onClick={exportToPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-1 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                PDF
              </button>
              <button
                onClick={fetchData}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-1 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {reportData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(reportData[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {value !== null && value !== undefined
                            ? String(value)
                            : "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No data available for the selected report type.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
