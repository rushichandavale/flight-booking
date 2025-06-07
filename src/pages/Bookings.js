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
    <div className="min-h-screen bg-gray-50 py-12 px-2 sm:px-4 md:px-6 lg:px-8">
      <section
        className="max-w-7xl mx-auto min-w-[280px]"
        role="region"
        aria-labelledby="bookings-heading"
      >
        <h1
          id="bookings-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          My Bookings
        </h1>
        {userBookings.length === 0 ? (
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-teal-50 "
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <p className="text-base sm:text-lg text-gray-600">
              No bookings found. Book a flight to get started!
            </p>
            <button
              className="inline-block px-6 py-3 mt-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-teal-600 shadow-md focus:ring-2 focus:ring-blue-600"
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
            <table
              className="w-full table-auto border-collapse"
              role="table"
              aria-labelledby="bookings-heading"
            >
              <thead className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider rounded-tl-lg"
                  >
                    Flight
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Passengers
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider rounded-tr-lg"
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
                      className={`hover:bg-teal-50  ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                        {flight ? `${flight.from} → ${flight.to}` : 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                        {booking.bookingDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                        {Array.isArray(booking.passengers) ? booking.passengers.length : 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                        ₹{booking.totalPrice}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                        {booking.status}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex space-x-2">
                        <button
                          className="inline-block px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-teal-600  shadow-md focus:ring-2 focus:ring-blue-600"
                          onClick={() => handleViewDetails(booking.id)}
                          aria-label={`View booking ${booking.id}`}
                        >
                          View
                        </button>
                        {booking.status === 'Confirmed' && (
                          <button
                            className="inline-block px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium  shadow-md focus:ring-2 focus:ring-red-600"
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
        )}
      </section>
    </div>
  );
}

export default Bookings;