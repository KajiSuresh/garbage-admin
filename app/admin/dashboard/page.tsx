"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaPeopleGroup,
  FaPerson,
  FaCar,
  FaMotorcycle,
  FaClipboardList,
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout/Layout";
import StatCard from "../../components/dashboard/StatCard";

import { db } from "../../../lib/firebase";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userLevel: string | string[];
  status: string;
}

interface Vehicle {
  id: string;
  vehicleNo: string;
  status: string;
  lastServiceDate: Timestamp | string;
  createdAt: Timestamp;
}

interface Ride {
  id: string;
  vehicleNo: string;
  driverId: string;
  status: string;
  timestamp: Timestamp;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [finishedRides, setFinishedRides] = useState(0);
  const [assignedRides, setAssignedRides] = useState(0);
  const [monthlyRides, setMonthlyRides] = useState(Array(12).fill(0));
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<User[]>([]);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const usersSnapshot = await getDocs(
          query(collection(db, "users"), where("userLevel", "==", "User"))
        );
        setTotalUsers(usersSnapshot.size);

        const driversSnapshot = await getDocs(
          query(collection(db, "users"), where("userLevel", "==", "Driver"))
        );
        setTotalDrivers(driversSnapshot.size);

        const availableDriversSnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("userLevel", "==", "Driver"),
            where("status", "==", "online"),
            limit(5)
          )
        );

        const availableDriversData = availableDriversSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as User[];

        setAvailableDrivers(availableDriversData);

        const vehiclesSnapshot = await getDocs(
          query(collection(db, "vehicles"), where("status", "==", "Available"))
        );
        setTotalVehicles(vehiclesSnapshot.size);

        const recentVehiclesSnapshot = await getDocs(
          query(
            collection(db, "vehicles"),
            orderBy("createdAt", "desc"),
            limit(5)
          )
        );

        const recentVehiclesData = recentVehiclesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];

        setRecentVehicles(recentVehiclesData);

        const ridesSnapshot = await getDocs(
          query(collection(db, "rides"), orderBy("timestamp", "desc"))
        );
        setTotalRides(ridesSnapshot.size);

        const finishedRidesSnapshot = await getDocs(
          query(collection(db, "rides"), where("status", "==", "Completed"))
        );
        setFinishedRides(finishedRidesSnapshot.size);

        const assignedRidesSnapshot = await getDocs(
          query(collection(db, "rides"), where("status", "==", "Assigned"))
        );
        setAssignedRides(assignedRidesSnapshot.size);

        const recentRidesSnapshot = await getDocs(
          query(collection(db, "rides"), orderBy("timestamp", "desc"), limit(5))
        );

        const recentRidesData = recentRidesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ride[];

        setRecentRides(recentRidesData);

        const now = new Date();
        const monthlyRidesData = Array(12).fill(0);

        for (let i = 0; i < 12; i++) {
          const month = now.getMonth() - i;
          const year = now.getFullYear() - (month < 0 ? 1 : 0);
          const adjustedMonth = month < 0 ? month + 12 : month;

          const startDate = new Date(year, adjustedMonth, 1);
          const endDate = new Date(year, adjustedMonth + 1, 0, 23, 59, 59);

          const monthlyRidesSnapshot = await getDocs(
            query(
              collection(db, "rides"),
              where("timestamp", ">=", Timestamp.fromDate(startDate)),
              where("timestamp", "<=", Timestamp.fromDate(endDate))
            )
          );

          monthlyRidesData[11 - i] = monthlyRidesSnapshot.size;
        }

        setMonthlyRides(monthlyRidesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = monthlyRides.map((value, index) => ({
    name: monthNames[index],
    rides: value,
  }));

  const pieData = [
    { name: "Completed", value: finishedRides },
    { name: "Assigned", value: assignedRides },
    { name: "Other", value: totalRides - finishedRides - assignedRides },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#6b7280"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back, Admin. Here's what's happening today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<FaPeopleGroup />}
              title="Total Users"
              value={totalUsers}
              color="bg-blue-500"
            />
            <StatCard
              icon={<FaPerson />}
              title="Total Drivers"
              value={totalDrivers}
              color="bg-orange-500"
            />
            <StatCard
              icon={<FaCar />}
              title="Total Vehicles"
              value={totalVehicles}
              color="bg-green-500"
            />
            <StatCard
              icon={<FaMotorcycle />}
              title="Total Rides"
              value={totalRides}
              color="bg-red-500"
            />
            <StatCard
              icon={<FaCheckCircle />}
              title="Completed Rides"
              value={finishedRides}
              color="bg-purple-500"
            />
            <StatCard
              icon={<FaClipboardList />}
              title="Assigned Rides"
              value={assignedRides}
              color="bg-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Monthly Rides</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rides" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">
                Ride Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {pieData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Vehicle No</th>
                <th className="p-2 text-left">Driver ID</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentRides.map((ride) => (
                <tr key={ride.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{ride.vehicleNo}</td>
                  <td className="p-2">{ride.driverId}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ride.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : ride.status === "Assigned"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {ride.timestamp.toDate().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Available Drivers</h2>
          <ul className="divide-y">
            {availableDrivers.length > 0 ? (
              availableDrivers.map((driver) => (
                <li key={driver.id} className="py-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                    {driver.firstName[0]}
                    {driver.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{`${driver.firstName} ${driver.lastName}`}</p>
                    <p className="text-sm text-gray-500">{driver.userName}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Online
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">
                No available drivers at the moment
              </p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent Vehicles</h2>
          <ul className="divide-y">
            {recentVehicles.map((vehicle) => (
              <li key={vehicle.id} className="py-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                  <FaCar />
                </div>
                <div>
                  <p className="font-medium">{vehicle.vehicleNo}</p>
                  <p className="text-sm text-gray-500">
                    Last Service:{" "}
                    {vehicle.lastServiceDate instanceof Timestamp
                      ? vehicle.lastServiceDate.toDate().toLocaleDateString()
                      : typeof vehicle.lastServiceDate === "string"
                      ? vehicle.lastServiceDate
                      : "No date available"}
                  </p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      vehicle.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
