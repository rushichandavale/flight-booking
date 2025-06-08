import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStorage } from '../services/storage';
import { InputField } from '../components/Common';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

function BookingDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { flights, bookings } = useSelector((state) => state.flights);

  const [flight, setFlight] = useState(state?.flight || {});
  const [passengers, setPassengers] = useState(state?.passengers || [{ name: '', age: '' }]);
  const [booking, setBooking] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const storedBookings = getStorage('bookings') || [];
      const foundBooking = storedBookings.find((b) => b.id === id && b.userId === user?.id);
      if (foundBooking) {
        setBooking(foundBooking);
        const foundFlight = flights.find((f) => f.id === foundBooking.flightId);
        setFlight(foundFlight || {});
        setPassengers(foundBooking.passengers || []);
      } else {
        setErrors({ form: 'Booking not found or unauthorized' });
      }
    }
    // Scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id, user, flights]);

  const seatsAvailable = (flight.seatsAvailable || 0) - (flight.seatsBooked || 0);

  const addPassenger = () => {
    if (passengers.length < 5 && passengers.length < seatsAvailable) {
      setPassengers([...passengers, { name: '', age: '' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      setErrors({});
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
    setErrors((prev) => ({ ...prev, [`${field}${index}`]: '' }));
  };

  const validatePassengers = () => {
    const newErrors = {};
    passengers.forEach((p, index) => {
      if (!p.name) newErrors[`name${index}`] = 'Required';
      if (!p.age || p.age < 0) newErrors[`age${index}`] = 'Valid age required';
    });
    if (passengers.length > seatsAvailable) {
      newErrors.form = 'Not enough seats available';
    }
    if (!flight.id) {
      newErrors.form = 'Invalid flight selected';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      return;
    }
    const newErrors = validatePassengers();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    navigate('/payment', { state: { flight, passengers, user } });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (errors.form && id) {
    return (
      <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <section
          className="max-w-md mx-auto min-w-[280px]"
          role="region"
          aria-labelledby="error-heading"
        >
          <h1
            id="error-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Error
          </h1>
          <div
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:bg-teal-50"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <p className="text-red-500 text-sm sm:text-base mb-4" data-aos="fade-up" data-aos-duration="1000">
              {errors.form}
            </p>
            <div className="flex justify-end">
              <button
                className="inline-block p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-100 focus:ring-2 focus:ring-blue-600"
                onClick={() => navigate('/bookings')}
                aria-label="Back to bookings"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <FaArrowLeft className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <section
        className="max-w-7xl mx-auto min-w-[280px]"
        role="region"
        aria-labelledby="booking-details-heading"
      >
        <h1
          id="booking-details-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {id ? 'Booking Details' : 'Enter Booking Details'}
        </h1>
        <div
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 hover:bg-teal-50 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Flight Details</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Route:</span> {flight.from || 'N/A'} → {flight.to || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Airline:</span> {flight.airline || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Time:</span> {flight.departureTime || 'N/A'} -{' '}
              {flight.arrivalTime || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Stops:</span> {flight.stops || 0}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Seats Available:</span> {seatsAvailable}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Total Price:</span> ₹{(flight.price || 0) * passengers.length}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Duration:</span> {flight.duration || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">Aircraft:</span> {flight.aircraft || 'N/A'}
            </p>
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6 hover:bg-teal-50 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-duration="1300"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Passenger Details</h2>
          {id && booking ? (
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-teal-50 hover:shadow-md transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-duration={1300 + index * 100}
                >
                  <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    Passenger {index + 1}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">Name: {passenger.name}</p>
                  <p className="text-gray-600 text-sm sm:text-base">Age: {passenger.age}</p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-4 relative hover:bg-teal-50 hover:shadow-md transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-duration={1300 + index * 100}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">
                      Passenger {index + 1}
                    </p>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-all duration-200 focus:ring-2 focus:ring-red-600"
                        aria-label={`Remove passenger ${index + 1}`}
                        tabIndex={0}
                      >
                        <FaTrash className="text-sm sm:text-base" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                    <InputField
                      label="Name"
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      name={`name${index}`}
                      placeholder="Passenger Name"
                      error={errors[`name${index}`]}
                      aria-invalid={!!errors[`name${index}`]}
                      aria-describedby={errors[`name${index}`] ? `name${index}-error` : undefined}
                    />
                    <InputField
                      label="Age"
                      type="number"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      name={`age${index}`}
                      placeholder="Age"
                      error={errors[`age${index}`]}
                      aria-invalid={!!errors[`age${index}`]}
                      aria-describedby={errors[`age${index}`] ? `age${index}-error` : undefined}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPassenger}
                className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium hover:underline transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-600 pr-3"
                disabled={passengers.length >= 5 || passengers.length >= seatsAvailable}
                aria-label="Add another passenger"
              >
                + Add Passenger (Max {Math.min(5, seatsAvailable)})
              </button>
              {errors.form && (
                <div
                  className="bg-red-100 text-red-700 p-3 rounded-lg text-sm sm:text-base sm:text-center"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <p>{errors.form}</p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 shadow-md focus:ring-2 focus:ring-blue-600"
                  type="submit"
                  aria-label="Proceed to payment"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}
          {id && booking && (
            <div className="flex justify-end mt-4">
              <button
                className="inline-block p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-100 focus:ring-2 focus:ring-blue-600"
                onClick={() => navigate(state?.from || '/bookings')}
                aria-label="Back to bookings"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <FaArrowLeft className="text-lg sm:text-xl" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default BookingDetails;