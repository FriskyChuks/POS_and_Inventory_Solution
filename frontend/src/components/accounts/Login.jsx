import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/auth.css';
import axiosInstance from '../../utils/axiosInstance'
import Message from '../effects/Message';

const Login = ({ baseURL }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(
      location.state?.message
        ? { text: location.state.message, type: location.state.type }
        : { text: '', type: '' }
    );

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Get token
      const response = await axiosInstance.post(`${baseURL}/auth/jwt/create/`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      axiosInstance.defaults.headers.common['Authorization'] = `FRISKYTECH ${access}`;

      // Step 2: Get current user info
      const userRes = await axiosInstance.get(`${baseURL}/auth/users/me/`);
      localStorage.setItem('user', JSON.stringify(userRes.data));

      // Step 3: Show success and redirect
      setMessage({ type: 'success', text: 'Login successful!' });

      // ✅ Redirect to previous path or home
      const redirectPath = localStorage.getItem('redirect_after_login');
      if (redirectPath) {
        localStorage.removeItem('redirect_after_login');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Login failed. Please try again.',
      });
    }
  };


  return (
    <div className="auth-page container">
      <div className="auth-card">
        <Message text={message.text} type={message.type} />

        <div className="text-center mb-4">
          <h3>FriskyBiz</h3>
          <p style={{fontStyle:"italic"}} className='mb-3'>A simple, all-in-one software business solution.</p>
          <p className="text-muted">Sign in to continue.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary w-100">
            SIGN IN
          </button>
        </form>
        <br />
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* <div className="form-check">
            <input className="form-check-input" type="checkbox" id="remember" />
            <label className="form-check-label" htmlFor="remember">
              Keep me signed in
            </label>
          </div> */}
          <Link to="/auth/reset-password" className="small">Forgot password?</Link>
        </div>
        <br />
        <div className="text-center mt-3">
          Don't have an account? <Link to="/auth/register">Create</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
