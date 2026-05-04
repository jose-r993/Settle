import React from "react";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Zillow Admin</h2>
        <nav className="space-y-3 text-sm">
          <p className="font-semibold">Dashboard</p>
          <p>Analytics</p>
          <p>Listings</p>
          <p>Bookings</p>
          <p>Users</p>
          <p>Settings</p>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card title="Active Listings" value="2,847" />
          <Card title="Bookings Today" value="143" />
          <Card title="Avg Price" value="$485K" />
          <Card title="Agents Online" value="38" />
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Listing Activity</h3>
          <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
