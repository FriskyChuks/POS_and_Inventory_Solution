import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import useAuth from "../accounts/useAuth";

function CreateBrand({ baseURL }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    item: "",
    stock_level: 0,
    barcode: "",
    cost_price: "",
    selling_price: "",
    created_by: user.id,
  });
  const [message, setMessage] = useState(null);
  const [checkingBarcode, setCheckingBarcode] = useState(false);
  const [barcodeExists, setBarcodeExists] = useState(false);
  const navigate = useNavigate();

  // Fetch items for dropdown
  useEffect(() => {
    axiosInstance
      .get(`${baseURL}/items/`)
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        setMessage({ type: "error", text: "Failed to load items." });
      });
  }, [baseURL]);

  // Generate a simple unique barcode
  const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    return `BR-${timestamp}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check barcode uniqueness on change
    if (name === "barcode" && value.trim()) {
      setCheckingBarcode(true);
      axiosInstance
        .get(`${baseURL}/brands/search/?search=${encodeURIComponent(value)}`)
        .then((res) => {
          const exists = res.data.some(
            (brand) => brand.barcode?.toString() === value.toString()
          );
          setBarcodeExists(exists);
          setCheckingBarcode(false);
        })
        .catch(() => {
          setCheckingBarcode(false);
          setBarcodeExists(false);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (barcodeExists) {
      setMessage({
        type: "warning",
        text: "⚠️ This barcode already exists. Please use a unique barcode.",
      });
      return;
    }

    // Auto-generate barcode if left empty
    let brandData = { ...formData };
    if (!brandData.barcode || !brandData.barcode.trim()) {
      brandData.barcode = generateBarcode();
    }

    axiosInstance
      .post(`${baseURL}/brands/`, brandData)
      .then(() => {
        setMessage({ type: "success", text: "Brand created successfully!" });
        setTimeout(() => navigate("/brand-list"), 1500);
      })
      .catch((err) => {
        console.error("Brand creation failed:", err);
        setMessage({
          type: "error",
          text: "Brand creation failed. Check your input.",
        });
      });
  };

  return (
    <div className="container mt-4">
      <h2>Create New Brand</h2>

      {message && (
        <div
          className={`alert alert-${
            message.type === "error"
              ? "danger"
              : message.type === "warning"
              ? "warning"
              : "success"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Brand & Barcode Row */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Brand Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Barcode</label>
            <div className="input-group">
              <input
                type="text"
                name="barcode"
                className={`form-control ${
                  barcodeExists ? "is-invalid" : ""
                }`}
                placeholder="Scan or enter barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    barcode: generateBarcode(),
                  }))
                }
              >
                Regenerate
              </button>
            </div>
            {checkingBarcode && (
              <small className="text-muted">Checking barcode...</small>
            )}
            {barcodeExists && (
              <div className="invalid-feedback">
                This barcode is already registered.
              </div>
            )}
          </div>
        </div>

        {/* Parent Item */}
        <div className="mb-3">
          <label className="form-label">Parent Item</label>
          <select
            name="item"
            className="form-control"
            value={formData.item}
            onChange={handleChange}
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

        {/* Prices Row */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Cost Price</label>
            <input
              type="number"
              step="0.01"
              name="cost_price"
              className="form-control"
              value={formData.cost_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Selling Price</label>
            <input
              type="number"
              step="0.01"
              name="selling_price"
              className="form-control"
              value={formData.selling_price}
              onChange={handleChange}
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
            className="form-control"
            value={formData.stock_level}
            onChange={handleChange}
            min={0}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Brand
        </button>
      </form>
    </div>
  );
}

export default CreateBrand;
