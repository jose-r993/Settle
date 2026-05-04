import React from "react";

export default function NotificationsPage() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <div className="w-56 bg-blue-900 text-white p-6 space-y-4">
        <h2 className="font-bold text-lg">Zillow</h2>
        <p>Dashboard</p>
        <p>Listings</p>
        <p>Bookings</p>
        <p className="font-semibold">Notifications</p>
        <p>Settings</p>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <Notification title="New Tour Booked" desc="342 Maple Ave - Tomorrow 10 AM" />
        <Notification title="Price Change Alert" desc="Dropped to $450K" />
        <Notification title="Listing Approved" desc="Your listing is live" />
      </div>

      {/* Detail Panel */}
      <div className="w-80 bg-white p-6 shadow-lg">
        <h3 className="font-bold mb-4">Details</h3>
        <p className="text-sm text-gray-600">Booking with Jordan Lee</p>

        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg">
          View Booking
        </button>
      </div>
    </div>
  );
}

function Notification({ title, desc }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
