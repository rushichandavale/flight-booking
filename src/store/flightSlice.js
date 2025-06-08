import { createSlice } from '@reduxjs/toolkit';
import { setStorage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  flights: [],
  bookings: [],
  searchResults: [],
  filters: {
    priceRange: [0, 20000],
    airlines: [],
    stops: [],
    timeSlots: [],
  },
};

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFlights: (state, action) => {
      state.flights = action.payload;
      setStorage('flights', action.payload);
    },
    addFlight: (state, action) => {
      const newFlight = { id: action.payload.id || uuidv4(), ...action.payload };
      state.flights.push(newFlight);
      setStorage('flights', state.flights);
    },
    editFlight: (state, action) => {
      const index = state.flights.findIndex((flight) => flight.id === action.payload.id);
      if (index !== -1) {
        state.flights[index] = { ...state.flights[index], ...action.payload };
        setStorage('flights', state.flights);
      }
    },
    deleteFlight: (state, action) => {
      state.flights = state.flights.filter((flight) => flight.id !== action.payload);
      setStorage('flights', state.flights);
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      setStorage('bookings', action.payload);
    },
    addBooking: (state, action) => {
      const newBooking = { id: uuidv4(), ...action.payload };
      state.bookings.push(newBooking);
      const flightIndex = state.flights.findIndex((f) => f.id === newBooking.flightId);
      if (flightIndex !== -1) {
        state.flights[flightIndex].seatsBooked += Array.isArray(newBooking.passengers) ? newBooking.passengers.length : 0;
      }
      setStorage('bookings', state.bookings);
      setStorage('flights', state.flights);
    },
    cancelBooking: (state, action) => {
      const bookingIndex = state.bookings.findIndex((b) => b.id === action.payload);
      if (bookingIndex !== -1) {
        const booking = state.bookings[bookingIndex];
        state.bookings[bookingIndex].status = 'Cancelled';
        const flightIndex = state.flights.findIndex((f) => f.id === booking.flightId);
        if (flightIndex !== -1) {
          state.flights[flightIndex].seatsBooked -= Array.isArray(booking.passengers) ? booking.passengers.length : 0;
        }
        setStorage('bookings', state.bookings);
        setStorage('flights', state.flights);
      }
    },
  },
});

export const {
  setFlights,
  addFlight,
  editFlight,
  deleteFlight,
  setSearchResults,
  clearSearchResults,
  setFilters,
  setBookings,
  addBooking,
  cancelBooking,
} = flightSlice.actions;
export default flightSlice.reducer;