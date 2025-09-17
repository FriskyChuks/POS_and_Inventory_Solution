import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Message from '../effects/Message'

const SupplyCreate = ({ baseURL }) => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const [formData, setFormData] = useState({
    item: '', brand: '', supplier: '', quantity: '', supply_price: ''
  })

  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetchItems()
    fetchSuppliers()
  }, [])

  const fetchItems = async () => {
    const res = await axiosInstance.get(`${baseURL}/items/`)
    setItems(res.data)
  }

  const fetchSuppliers = async () => {
    const res = await axiosInstance.get(`${baseURL}/accounts/suppliers/`)
    setSuppliers(res.data)
  }

  const fetchBrands = async (itemId) => {
    const res = await axiosInstance.get(`${baseURL}/brands/?item=${itemId}`)
    setBrands(res.data)
  }

  const handleItemChange = (e) => {
    const itemId = e.target.value
    setFormData({ ...formData, item: itemId, brand: '' })
    fetchBrands(itemId)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        brand: formData.brand,
        supplier: formData.supplier || null,
        quantity: parseInt(formData.quantity),
        supply_price: parseFloat(formData.supply_price)
      }

      await axiosInstance.post(`${baseURL}/supplies/`, payload)
      setMessage({ text: 'Supply successfully added', type: 'success' })
      navigate('/supply-list')
    } catch (err) {
      console.error(err)
      setMessage({ text: 'Error creating supply', type: 'error' })
    }
  }

  return (
    <>
      <Message text={message.text} type={message.type} />

      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">New Supply Entry</h4>
            <hr />

            <form className="forms-sample row g-3" onSubmit={handleSubmit}>

              {/* Item Select */}
              <div className="form-group col-md-6">
                <label>Item</label>
                <select className="form-control" name="item" value={formData.item} onChange={handleItemChange} required>
                  <option value="">-- Select Item --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <Link to="/item-create" className="btn btn-link p-0">+ Add Item</Link>
              </div>

              {/* Brand Select */}
              <div className="form-group col-md-6">
                <label>Brand</label>
                <select className="form-control" name="brand" value={formData.brand} onChange={handleChange} required>
                  <option value="">-- Select Brand --</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
                <Link to="/brand-create" className="btn btn-link p-0">+ Add Brand</Link>
              </div>

              {/* Supplier Select */}
              <div className="form-group col-md-6">
                <label>Supplier</label>
                <select className="form-control" name="supplier" value={formData.supplier} onChange={handleChange}>
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
                <Link to="/supplier-create" className="btn btn-link p-0">+ Add Supplier</Link>
              </div>

              {/* Quantity & Price */}
              <div className="form-group col-md-3">
                <label>Quantity</label>
                <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} required />
              </div>

              <div className="form-group col-md-3">
                <label>Supply Price</label>
                <input type="number" step="0.01" name="supply_price" className="form-control" value={formData.supply_price} onChange={handleChange} required />
              </div>

              {/* Submit Button */}
              <div className="form-group col-md-6">
                <button type="submit" className="btn btn-primary mr-2">Submit Supply</button>
                <Link to="/supply-list" className="btn btn-secondary">Cancel</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SupplyCreate
