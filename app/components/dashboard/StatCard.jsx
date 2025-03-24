"use client";

const StatCard = ({ icon, title, value, color }) => (
  <div className={`rounded-lg shadow-md text-white ${color} transition-transform duration-300 transform hover:scale-105`}>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
          <p className="text-sm opacity-90 mt-1">{title}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
    <div className="bg-black bg-opacity-20 p-2 text-xs text-right">
      <span>Last updated: Today</span>
    </div>
  </div>
);

export default StatCard;