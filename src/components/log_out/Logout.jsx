import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Update authentication state in the application
    if (onLogout) {
      onLogout();
    }

    // Determine where to redirect
    const from = location.state?.from || '/login';
    
    // Redirect user to login page
    navigate(from, { replace: true });
  }, [navigate, onLogout, location.state]);

  // This component does not render anything visible
  return null;
};

Logout.propTypes = {
  onLogout: PropTypes.func,
};

export default Logout;