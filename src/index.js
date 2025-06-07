import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import {store} from './store';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';

AOS.init({ duration: 2000 }); // Initialize AOS with 2s animation duration

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);