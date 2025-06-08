import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBookings, cancelBooking } from '../store/flightSlice';
import { getStorage } from '../services/storage';

function Bookings() {
  const { user } = useSelector((state) => state.auth);
  const { bookings, flights } = useSelector((state) => state.flights);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const storedBookings = getStorage('bookings') || [];
    dispatch(setBookings(storedBookings));
  }, [user, dispatch, navigate]);

  const userBookings = bookings.filter((booking) => booking.userId === user.id);

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`, { state: { from: '/bookings' } });
  };

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <section
        className="max-w-7xl mx-auto min-w-[280px]"
        role="region"
        aria-labelledby="bookings-heading"
      >
        <h1
          id="bookings-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          My Bookings
        </h1>
        {userBookings.length === 0 ? (
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-teal-50"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <p className="text-sm sm:text-base text-gray-600">
              No bookings found. Book a flight to get started!
            </p>
            <button
              className="inline-block px-5 py-2 mt-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-sm sm:text-base font-medium hover:from-blue-700 hover:to-teal-600 shadow-md focus:ring-2 focus:ring-blue-600"
              onClick={() => navigate('/search')}
              aria-label="Book a flight"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg shadow-md"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table
                className="w-full table-auto border-collapse"
                role="table"
                aria-labelledby="bookings-heading"
              >
                <thead className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                    >
                      Flight
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Passengers
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Total Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userBookings.map((booking, index) => {
                    const flight = flights.find((f) => f.id === booking.flightId);
                    return (
                      <tr
                        key={booking.id}
                        className={`hover:bg-teal-50 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-[200px]">
                          {flight ? `${flight.from} → ${flight.to}` : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {Array.isArray(booking.passengers) ? booking.passengers.length : 0}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          ₹{booking.totalPrice}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {booking.status}
                        </td>
                        <td className="px-4 py-4 text-sm flex space-x-2">
                          <button
                            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-teal-600 shadow-md focus:ring-2 focus:ring-blue-600"
                            onClick={() => handleViewDetails(booking.id)}
                            aria-label={`View booking ${booking.id}`}
                          >
                            View
                          </button>
                          {booking.status === 'Confirmed' && (
                            <button
                              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 shadow-md focus:ring-2 focus:ring-red-600"
                              onClick={() => handleCancel(booking.id)}
                              aria-label={`Cancel booking ${booking.id}`}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4 p-4">
              {userBookings.map((booking, index) => {
                const flight = flights.find((f) => f.id === booking.flightId);
                return (
                  <div
                    key={booking.id}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm hover:bg-teal-50 transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold text-sm">Flight:</span>{' '}
                        {flight ? `${flight.from} → ${flight.to}` : 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Date:</span>{' '}
                        {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Passengers:</span>{' '}
                        {Array.isArray(booking.passengers) ? booking.passengers.length : 0}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Total Price:</span> ₹{booking.totalPrice}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Status:</span> {booking.status}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                      <button
                        className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-600 shadow-md focus:ring-2 focus:ring-blue-600"
                        onClick={() => handleViewDetails(booking.id)}
                        aria-label={`View booking ${booking.id}`}
                      >
                        View
                      </button>
                      {booking.status === 'Confirmed' && (
                        <button
                          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-md focus:ring-2 focus:ring-red-600"
                          onClick={() => handleCancel(booking.id)}
                          aria-label={`Cancel booking ${booking.id}`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Bookings;