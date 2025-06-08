import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { setStorage, getStorage } from '../services/storage';

const initialState = {
  user: null,
  isAuthenticated: false,
  sessionTimeout: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action) => {
      const { name, email, password, role } = action.payload;
      const users = getStorage('users') || [];
      if (users.find((u) => u.email === email)) {
        throw new Error('User already exists');
      }
      const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();
      const user = { id: uuidv4(), name, email, password: encryptedPassword, role };
      users.push(user);
      setStorage('users', users);
      state.user = user;
      state.isAuthenticated = true;
      state.sessionTimeout = Date.now() + 5 * 60 * 1000; // 5 minutes
      setStorage('currentUser', user);
    },
    login: (state, action) => {
      const { email, password } = action.payload;
      const users = getStorage('users') || [];
      const user = users.find((u) => u.email === email);
      if (user) {
        try {
          const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
          if (decryptedPassword === password) {
            state.user = user;
            state.isAuthenticated = true;
            state.sessionTimeout = Date.now() + 5 * 60 * 1000; // 5 minutes
            setStorage('currentUser', user);
          } else {
            throw new Error('Invalid password');
          }
        } catch (error) {
          console.error('Decryption error:', error);
          throw new Error('Invalid credentials');
        }
      } else {
        throw new Error('User not found');
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionTimeout = null;
      setStorage('currentUser', null);
    },
    updateSession: (state) => {
      if (state.isAuthenticated) {
        state.sessionTimeout = Date.now() + 5 * 60 * 1000;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionTimeout = Date.now() + 5 * 60 * 1000;
      setStorage('currentUser', action.payload);
    },
  },
});

export const { signup, login, logout, updateSession, setUser } = authSlice.actions;
export default authSlice.reducer;