import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFlight, editFlight, deleteFlight, setFlights } from '../store/flightSlice';
import { InputField, SelectField, Button } from '../components/Common';
import { FaEdit, FaTrash, FaPlane, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import { getStorage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

const cities = [
  { value: 'Pune', label: 'Pune' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Chennai', label: 'Chennai' },
];

const timeSlots = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

function FlightForm({ form, setForm, isEditing, onSubmit, onCancel }) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.from) newErrors.from = 'Required';
    if (!form.to) newErrors.to = 'Required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price required';
    if (!form.airline) newErrors.airline = 'Required';
    if (!form.departureTime) newErrors.departureTime = 'Required';
    if (!form.arrivalTime) newErrors.arrivalTime = 'Required';
    if (form.seatsAvailable && form.seatsAvailable < 0) newErrors.seatsAvailable = 'Cannot be negative';
    if (form.seatsBooked && form.seatsBooked < 0) newErrors.seatsBooked = 'Cannot be negative';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Flight Details</h3>
      </div>
      <SelectField
        label="From"
        name="from"
        value={form.from}
        onChange={handleChange}
        options={[{ value: '', label: 'Select City' }, ...cities]}
        error={errors.from}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <SelectField
        label="To"
        name="to"
        value={form.to}
        onChange={handleChange}
        options={[{ value: '', label: 'Select City' }, ...cities]}
        error={errors.to}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Price (₹)"
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="e.g., 5000"
        error={errors.price}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Airline"
        type="text"
        name="airline"
        value={form.airline}
        onChange={handleChange}
        placeholder="e.g., AirIndia"
        error={errors.airline}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule</h3>
      </div>
      <InputField
        label="Stops"
        type="number"
        name="stops"
        value={form.stops}
        onChange={handleChange}
        placeholder="e.g., 0"
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Departure Time"
        type="time"
        name="departureTime"
        value={form.departureTime}
        onChange={handleChange}
        error={errors.departureTime}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Arrival Time"
        type="time"
        name="arrivalTime"
        value={form.arrivalTime}
        onChange={handleChange}
        error={errors.arrivalTime}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Duration (e.g., 2h 30m)"
        type="text"
        name="duration"
        value={form.duration}
        onChange={handleChange}
        placeholder="e.g., 2h 30m"
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Capacity</h3>
      </div>
      <InputField
        label="Seats Available"
        type="number"
        name="seatsAvailable"
        value={form.seatsAvailable}
        onChange={handleChange}
        placeholder="e.g., 50"
        error={errors.seatsAvailable}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Seats Booked"
        type="number"
        name="seatsBooked"
        value={form.seatsBooked}
        onChange={handleChange}
        placeholder="e.g., 0"
        error={errors.seatsBooked}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <InputField
        label="Aircraft"
        type="text"
        name="aircraft"
        value={form.aircraft}
        onChange={handleChange}
        placeholder="e.g., Boeing 737"
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <SelectField
        label="Time Slot"
        name="timeSlot"
        value={form.timeSlot}
        onChange={handleChange}
        options={[{ value: '', label: 'Select Time Slot' }, ...timeSlots]}
        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
      />
      <div className="col-span-1 md:col-span-2 flex gap-4">
        <Button className="flex-1">{isEditing ? 'Update Flight' : 'Add Flight'}</Button>
        <Button className="flex-1 bg-gray-500 hover:bg-gray-600" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {Object.values(errors).some((e) => e) && (
        <div className="col-span-1 md:col-span-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          Please correct the errors above.
        </div>
      )}
    </form>
  );
}

function FlightListItem({ flight, onEdit, onDelete }) {
  const seatsLeft = (flight.seatsAvailable || 0) - (flight.seatsBooked || 0);
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]">
      <div className="flex items-center gap-3">
        <FaPlane className="text-blue-500" />
        <div>
          <p className="font-semibold text-gray-800">
            {flight.from || 'N/A'} → {flight.to || 'N/A'} | {flight.airline || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            ₹{flight.price || 0} | {flight.departureTime || 'N/A'} - {flight.arrivalTime || 'N/A'}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                seatsLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {seatsLeft} seats left
            </span>
            {seatsLeft <= 5 && <FaExclamationTriangle className="text-red-500" />}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(flight)}
          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors duration-200"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(flight.id)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

function FlightManager() {
  const dispatch = useDispatch();
  const flights = useSelector((state) => state.flights.flights || []);
  const [form, setForm] = useState({
    id: '',
    from: '',
    to: '',
    price: '',
    airline: '',
    stops: '',
    departureTime: '',
    arrivalTime: '',
    seatsAvailable: '',
    seatsBooked: '',
    timeSlot: '',
    duration: '',
    aircraft: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync flights from localStorage to Redux
  useEffect(() => {
    const storedFlights = getStorage('flights') || [];
    if (storedFlights.length > 0 && flights.length === 0) {
      console.log(`Syncing ${storedFlights.length} flights from localStorage`);
      dispatch(setFlights(storedFlights));
    }
  }, [dispatch, flights.length]);

  const handleSubmit = () => {
    const flightData = {
      id: form.id || uuidv4(),
      from: form.from,
      to: form.to,
      price: parseInt(form.price),
      airline: form.airline,
      stops: parseInt(form.stops) || 0,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      seatsAvailable: parseInt(form.seatsAvailable) || 50,
      seatsBooked: parseInt(form.seatsBooked) || 0,
      timeSlot: form.timeSlot || 'morning',
      duration: form.duration,
      aircraft: form.aircraft,
    };
    if (isEditing) {
      dispatch(editFlight(flightData));
    } else {
      dispatch(addFlight(flightData));
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: '',
      from: '',
      to: '',
      price: '',
      airline: '',
      stops: '',
      departureTime: '',
      arrivalTime: '',
      seatsAvailable: '',
      seatsBooked: '',
      timeSlot: '',
      duration: '',
      aircraft: '',
    });
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleEdit = (flight) => {
    setForm(flight);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      dispatch(deleteFlight(id));
    }
  };

  const handleAddFlight = () => {
    setIsEditing(false);
    setForm({
      id: '',
      from: '',
      to: '',
      price: '',
      airline: '',
      stops: '',
      departureTime: '',
      arrivalTime: '',
      seatsAvailable: '',
      seatsBooked: '',
      timeSlot: '',
      duration: '',
      aircraft: '',
    });
    setIsFormOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(flights.length / itemsPerPage);
  const paginatedFlights = flights.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <FlightForm
            form={form}
            setForm={setForm}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Flight List</h2>
        <button
          onClick={handleAddFlight}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full hover:from-blue-700 hover:to-teal-600 transition-colors duration-200 flex items-center gap-2"
        >
          <FaPlus /> Add Flight
        </button>
      </div>
      <div className="space-y-3 min-h-fit overflow-visible">
        {flights.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No flights available. Add a flight to get started.</p>
        ) : paginatedFlights.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No flights on this page.</p>
        ) : (
          paginatedFlights.map((flight) => (
            <FlightListItem
              key={flight.id}
              flight={flight}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      {flights.length > itemsPerPage && (
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

export default FlightManager;