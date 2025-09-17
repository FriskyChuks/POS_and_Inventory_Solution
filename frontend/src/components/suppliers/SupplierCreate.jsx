import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import Message from "../effects/Message"
import useAuth from "../accounts/useAuth"

const SupplierCreate = ({ baseURL }) => {
  const {user} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    email: '',
    address: '',
    created_by:user.id,
  })

  const [message, setMessage] = useState({ text: '', type: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("formData:", formData)
    try {
      await axiosInstance.post(`${baseURL}/accounts/suppliers/`, formData)
      setMessage({ text: 'Supplier created successfully', type: 'success' })
      navigate('/supplier-list')
    } catch (err) {
      console.error(err)
      setMessage({ text: 'Error creating supplier', type: 'error' })
    }
  }

  return (
    <>
      <Message text={message.text} type={message.type} />

      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">
              <i className="mdi mdi-plus-circle-outline" title="Add Supplier"></i> Add New Supplier
            </h4>
            <hr />

            <form className="forms-sample row g-3" onSubmit={handleSubmit}>

              <div className="form-group col-md-12">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Supplier Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group col-md-4">
                <label>Phone 1</label>
                <input
                  type="text"
                  name="phone1"
                  className="form-control"
                  placeholder="Primary Phone"
                  value={formData.phone1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group col-md-4">
                <label>Phone 2</label>
                <input
                  type="text"
                  name="phone2"
                  className="form-control"
                  placeholder="Secondary Phone (optional)"
                  value={formData.phone2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group col-md-4">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group col-md-12">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="4"
                  placeholder="Supplier Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group col-md-6">
                <button type="submit" className="btn btn-success mr-2">Submit</button>
                <Link to="/supplier-list" className="btn btn-secondary">Cancel</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SupplierCreate
