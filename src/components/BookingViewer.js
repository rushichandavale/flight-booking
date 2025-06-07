import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getStorage } from '../services/storage';
import { InputField } from '../components/Common';
import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';

function BookingViewer() {
  const { bookings } = useSelector((state) => state.flights || { bookings: [] });
  const flights = getStorage('flights') || [];
  const users = getStorage('users') || [];
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = bookings.filter((booking) => {
    const flight = flights.find((f) => f.id === booking.flightId);
    const user = users.find((u) => u.id === booking.userId);
    const searchLower = search.toLowerCase();
    return (
      booking.id?.toLowerCase().includes(searchLower) ||
      flight?.from?.toLowerCase().includes(searchLower) ||
      flight?.to?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower)
    );
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const flightA = flights.find((f) => f.id === a.flightId) || {};
    const flightB = flights.find((f) => f.id === b.flightId) || {};
    const userA = users.find((u) => u.id === a.userId) || {};
    const userB = users.find((u) => u.id === b.userId) || {};

    let valA, valB;
    if (sortField === 'route') {
      valA = `${flightA.from || ''}-${flightA.to || ''}`;
      valB = `${flightB.from || ''}-${flightB.to || ''}`;
    } else if (sortField === 'email') {
      valA = userA.email || '';
      valB = userB.email || '';
    } else if (sortField === 'price') {
      valA = a.totalPrice || 0;
      valB = b.totalPrice || 0;
    } else {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    }

    return sortOrder === 'asc' ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings</h2>
      <div className="relative mb-6">
        <InputField
          label="Search Bookings"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by booking ID, city, or email"
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-600"
        />
        <FaSearch className="absolute right-3 top-10 text-gray-500" />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
            <tr>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Booking ID
                  {sortField === 'id' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  User Email
                  {sortField === 'email' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort('route')}
              >
                <div className="flex items-center">
                  Flight
                  {sortField === 'route' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="p-3 text-left">Passengers</th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Total Price
                  {sortField === 'price' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {sortField === 'date' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((booking, index) => {
              const flight = flights.find((f) => f.id === booking.flightId) || {};
              const user = users.find((u) => u.id === booking.userId) || {};
              return (
                <tr
                  key={booking.id}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="p-3">{booking.id}</td>
                  <td className="p-3">{user.email || 'N/A'}</td>
                  <td className="p-3">
                    {flight.from || 'N/A'} → {flight.to || 'N/A'}
                  </td>
                  <td className="p-3">{booking.passengers?.length || 0}</td>
                  <td className="p-3">₹{booking.totalPrice || 0}</td>
                  <td className="p-3">{new Date(booking.date).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {paginatedBookings.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No bookings found.</p>
      )}
      {filteredBookings.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-full ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingViewer;