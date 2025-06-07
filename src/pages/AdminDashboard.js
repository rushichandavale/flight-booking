import { useState } from 'react';
import FlightManager from '../components/FlightManager';
import BookingViewer from '../components/BookingViewer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function AdminDashboard() {
  const [isFlightsOpen, setIsFlightsOpen] = useState(true);
  const [isBookingsOpen, setIsBookingsOpen] = useState(true);
  const flights = useSelector((state) => state.flights.flights || []);
  const bookings = useSelector((state) => state.flights.bookings || []);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Total Flights</h3>
            <p className="text-3xl font-bold text-blue-600">{flights.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Total Bookings</h3>
            <p className="text-3xl font-bold text-teal-500">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
            </p>
          </div>
        </div>
        {/* Collapsible Sections */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-visible">
            <button
              onClick={() => setIsFlightsOpen(!isFlightsOpen)}
              className="w-full flex justify-between items-center p-6 text-xl font-bold text-gray-800 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200"
            >
              Manage Flights
              {isFlightsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isFlightsOpen ? 'min-h-fit' : 'max-h-0 overflow-hidden'
              }`}
            >
              {isFlightsOpen && <FlightManager />}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-visible">
            <button
              onClick={() => setIsBookingsOpen(!isBookingsOpen)}
              className="w-full flex justify-between items-center p-6 text-xl font-bold text-gray-800 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200"
            >
              View Bookings
              {isBookingsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isBookingsOpen ? 'min-h-fit' : 'max-h-0 overflow-hidden'
              }`}
            >
              {isBookingsOpen && <BookingViewer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;