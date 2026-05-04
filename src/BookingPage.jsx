import React from "react";

export default function BookingPage() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <div className="w-56 bg-blue-900 text-white p-6 space-y-4">
        <h2 className="font-bold text-lg">Zillow</h2>
        <p>Home</p>
        <p>Search</p>
        <p className="font-semibold">Book Tour</p>
        <p>Messages</p>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold">Choose Date & Time</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            Calendar Placeholder
          </div>

          <div className="flex gap-2 flex-wrap">
            {["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"].map(t => (
              <button key={t} className="px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="w-80 bg-white p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
        <p className="text-sm text-gray-600">342 Maple Ave</p>
        <p className="text-sm">Time: 10:00 AM</p>
        <p className="text-sm">Agent: Jordan Lee</p>

        <h2 className="text-xl font-bold mt-4">$120,000</h2>

        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
