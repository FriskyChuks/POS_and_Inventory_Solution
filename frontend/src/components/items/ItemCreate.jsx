import axiosInstance from '../../utils/axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Message from '../effects/Message';
import LoadingSpinner from '../effects/LoadingSpinner';
import useAuth from '../accounts/useAuth';

const ItemCreate = ({ baseURL }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock_level: 0,
    created_by: user.id, // Assuming user.id is available
  });

  useEffect(() => {
    axiosInstance.get(`${baseURL}/item-category/`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Category Fetch Error", err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`${baseURL}/items/`, formData);

      setMessage({ text: `${formData.name} created successfully`, type: 'success' });

      setTimeout(() => {
        setIsLoading(false);
        navigate('/item-list');
      }, 700);

    } catch (err) {
      setMessage({
        text: 'Error: ' + (err.response?.data?.detail || 'Item creation failed'),
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Message text={message.text} type={message.type} />
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">
              <i className="mdi mdi-plus-box"></i> Create New Item
            </h4>
            {isLoading ? (
              <LoadingSpinner text="Creating item, please wait..." />
            ) : (
              <form className="forms-sample row g-3" onSubmit={handleSubmit}>
                <div className="form-group col-md-6">
                  <label htmlFor="name">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol"
                    required
                  />
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="category">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-md-12">
                  <button
                    type="submit"
                    className={isLoading ? 'btn btn-primary opacity-50' : 'btn btn-primary'}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                  <Link to="/item-list" className="btn btn-secondary ml-2">Cancel</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCreate;
