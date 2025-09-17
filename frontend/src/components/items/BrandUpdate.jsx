import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

function BrandUpdate({ baseURL }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brandData, setBrandData] = useState({
    item: "",
    name: "",
    barcode: "",
    cost_price: "",
    selling_price: "",
    stock_level: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    axiosInstance
      .get(`${baseURL}/items/`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Failed to load items:", error));
  }, [baseURL]);

  useEffect(() => {
    axiosInstance
      .get(`${baseURL}/brand-update/${id}/`)
      .then((response) => {
        setBrandData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brand:", error);
        setMessage({ text: "Failed to load brand data", type: "danger" });
        setLoading(false);
      });
  }, [id, baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate a simple unique barcode
  const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `BR-${timestamp}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedData = { ...brandData };
    if (!updatedData.barcode || !updatedData.barcode.trim()) {
      updatedData.barcode = generateBarcode();
    }

    axiosInstance
      .patch(`${baseURL}/brand-update/${id}/`, updatedData)
      .then(() => {
        setMessage({ text: "Brand updated successfully", type: "success" });
        setTimeout(() => navigate("/brand-list"), 1500);
      })
      .catch((error) => {
        console.error("Update failed:", error);
        setMessage({ text: "Update failed", type: "danger" });
      });
  };

  if (loading) return <p>Loading brand data...</p>;

  return (
    <div className="container mt-4">
      <h4>Update Brand</h4>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Item */}
        <div className="mb-3">
          <label className="form-label">Parent Item</label>
          <select
            name="item"
            value={brandData.item}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Select Item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Name + Barcode */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Brand Name</label>
            <input
              type="text"
              name="name"
              value={brandData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Barcode</label>
            <div className="input-group">
              <input
                type="text"
                name="barcode"
                value={brandData.barcode}
                onChange={handleChange}
                className="form-control"
                placeholder="Scan or enter barcode"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setBrandData((prev) => ({
                    ...prev,
                    barcode: generateBarcode(),
                  }))
                }
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Cost & Selling Price */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Cost Price</label>
            <input
              type="number"
              step="0.01"
              name="cost_price"
              value={brandData.cost_price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Selling Price</label>
            <input
              type="number"
              step="0.01"
              name="selling_price"
              value={brandData.selling_price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock Level</label>
          <input
            type="number"
            name="stock_level"
            value={brandData.stock_level}
            onChange={handleChange}
            className="form-control"
            required
            min={0}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Brand
        </button>
      </form>
    </div>
  );
}

export default BrandUpdate;
