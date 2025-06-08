import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFlights, setBookings } from './store/flightSlice';
import { setUser } from './store/authSlice';
import { initializeStorage } from './services/initializeStorage';
import { getStorage } from './services/storage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import BookingDetails from './pages/BookingDetails';
import PaymentForm from './pages/PaymentForm';
import Confirmation from './pages/Confirmation';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Offers from './pages/Offers';
import Destinations from './pages/Destinations';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import SessionManager from './components/SessionManager';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize localStorage
    initializeStorage();

    // Sync localStorage with Redux
    const flights = getStorage('flights');
    if (flights) {
      console.log(`Syncing ${flights.length} flights to Redux`);
      dispatch(setFlights(flights));
    }

    const bookings = getStorage('bookings');
    if (bookings) {
      console.log(`Syncing ${bookings.length} bookings to Redux`);
      dispatch(setBookings(bookings));
    }

    const users = getStorage('users');
    if (users && users.length > 0) {
      console.log(`Found ${users.length} users in localStorage`);
      // Optionally set current user if already logged in
      const currentUser = getStorage('currentUser');
      if (currentUser) {
        dispatch(setUser(currentUser));
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <SessionManager />
        <Navbar />
        <main className="flex-grow pt-[64px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/search"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><Search /></ProtectedRoute>}
            />
            <Route
              path="/booking-details"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><BookingDetails /></ProtectedRoute>}
            />
            <Route
              path="/booking-details/:id"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><BookingDetails /></ProtectedRoute>}
            />
            <Route
              path="/payment"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><PaymentForm /></ProtectedRoute>}
            />
            <Route
              path="/confirmation/:id"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><Confirmation /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><Profile /></ProtectedRoute>}
            />
            <Route
              path="/bookings"
              element={<ProtectedRoute allowedRoles={['User', 'Admin']}><Bookings /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;