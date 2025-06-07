import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import flightReducer from './flightSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightReducer,
    bookings: bookingReducer,
  },
});