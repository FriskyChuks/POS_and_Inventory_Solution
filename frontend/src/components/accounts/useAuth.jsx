import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
  }, []);

  const logout = () => {
    // ✅ Save current location so user can return after login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirect_after_login', currentPath);

    // Clear auth details
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Redirect to login page
    navigate('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    userGroup: user?.user_group?.title || null,
    isStaff: user?.is_staff || false,
    logout,
  };
};

export default useAuth;
