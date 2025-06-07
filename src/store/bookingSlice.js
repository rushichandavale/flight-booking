import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { setStorage, getStorage } from '../services/storage';

const initialState = {
  bookings: getStorage('bookings') || [],
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      const booking = { id: uuidv4(), ...action.payload };
      state.bookings.push(booking);
      setStorage('bookings', state.bookings);
    },
  },
});

export const { addBooking } = bookingSlice.actions;
export default bookingSlice.reducer;