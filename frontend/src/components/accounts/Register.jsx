import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/auth.css';
import axiosInstance from '../../utils/axiosInstance';
import Message from '../effects/Message';


const Register = ({ baseURL }) => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setMessage({
          type: 'error',
          text: 'Passwords do not match.',
        });
        return;
      }      
  
    try {
        await axiosInstance.post(`${baseURL}/auth/users/`, {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            re_password: formData.confirmPassword,
            });
  
      setMessage({type: 'success', text: 'Registration successful. You can now log in.',});
      navigate('/auth/login', {
        state: { message: 'Registration successful. You can now log in.', type: 'success' }
      });
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      setMessage({
        type: 'error',
        text: Object.values(error.response?.data || {}).flat().join(', ') || 'Registration failed.'
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
          <h4>Register a new account</h4>
          <p className="text-muted">Fill in the details to continue.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            CREATE ACCOUNT
          </button>
        </form>

        <div className="text-center mt-3">
          Already have an account? <Link to="/auth/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
