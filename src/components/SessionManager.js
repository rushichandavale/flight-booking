import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateSession } from '../store/authSlice';

function SessionManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, sessionTimeout } = useSelector((state) => state.auth);

  useEffect(() => {
    const resetTimeout = () => {
      dispatch(updateSession());
    };

    const events = ['click', 'mousemove', 'keypress'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    const checkTimeout = () => {
      if (isAuthenticated && sessionTimeout && Date.now() > sessionTimeout) {
        dispatch(logout());
        navigate('/login');
      }
    };

    const interval = setInterval(checkTimeout, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      clearInterval(interval);
    };
  }, [isAuthenticated, sessionTimeout, dispatch, navigate]);

  return null;
}

export default SessionManager;