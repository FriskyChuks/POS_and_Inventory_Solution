import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import Message from "../effects/Message"

const SupplyList = ({ baseURL }) => {
  const [supplies, setSupplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetchSupplies()
  }, [])

  const fetchSupplies = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/supplies/`)
      setSupplies(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setMessage({ text: 'Failed to load supplies', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <>
      <Message text={message.text} type={message.type} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="card-title">Supply Records</h4>
        <Link to="/supply-create" className="btn btn-primary">+ Add New Supply</Link>
      </div>

      {loading ? (
        <p>Loading supplies...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Item/Brand</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                {/* Optional: Actions */}
              </tr>
            </thead>
            <tbody>
              {supplies.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No supplies found.</td></tr>
              ) : (
                supplies.map((supply, index) => (
                  <tr key={supply.id}>
                    <td>{index + 1}</td>
                    <td>{supply.item_name || '—'} | {supply.brand_name || '—'}</td>
                    <td>{supply.supplier_name || 'N/A'}</td>
                    <td>{supply.quantity}</td>
                    <td>{parseFloat(supply.supply_price).toFixed(2)}</td>
                    <td>{supply.supply_date}</td>
                    {/* Future: <td><Link to={`/supply/${supply.id}`}>View</Link></td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default SupplyList
