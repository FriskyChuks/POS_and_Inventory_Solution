import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const SalesDashboard = ({ baseURL, formatNaira }) => {
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/auth/users/me/`);
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/reports/dashboard/daily-summary/?date=${date}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/reports/dashboard/monthly-summary/`);
      setMonthlyTrends(res.data);
    } catch (err) {
      console.error("Failed to load monthly sales trends", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchMonthlySales();
  }, []);

  useEffect(() => {
    fetchDailySummary();
  }, [date]);

  const isManagerOrAdmin = () => {
    const role = currentUser?.user_group?.title?.toLowerCase();
    return role === 'admin' || role === 'manager';
  };

  return (
    <div>
      <h4 className="mb-3">Sales Summary Dashboard</h4>

      {/* 📅 Date Filter */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label small">Select Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* 🔢 Summary + Alerts Row */}
      {summary && (
        <>
          {isManagerOrAdmin() && (
            <div className="row g-3 mb-4 align-items-start">
              {/* Summary Cards */}
              <div className="col-md-4">
                <div className="card border-success shadow-sm small">
                  <div className="card-body p-2">
                    <h6 className="text-success mb-1">Total Sales</h6>
                    <h6 className="mb-0">{formatNaira(summary.total_sales)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-info shadow-sm small">
                  <div className="card-body p-2">
                    <h6 className="text-info mb-1">Total Profit</h6>
                    <h6 className="mb-0">{formatNaira(summary.total_profit)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-primary shadow-sm small">
                  <div className="card-body p-2">
                    <h6 className="text-primary mb-1">Invoices</h6>
                    <h6 className="mb-0">{summary.invoice_count}</h6>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="col-md-4 mt-2">
                    <div className="card border-secondary shadow-sm small">
                        <div className="card-body p-2">
                        <h6 className="mb-2 text-secondary">💳 Payment Methods Used</h6>
                        <ul className="small mb-0 ps-3">
                            {Object.entries(summary.payment_methods).map(([method, count]) => (
                            <li key={method}>
                                {method.charAt(0).toUpperCase() + method.slice(1)} — {count} sale{count > 1 ? 's' : ''}
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
              </div>

              {/* 🔔 Low Stock Alerts */}
              <div className="col-md-8 mt-2">
                <div className="card border-warning shadow-sm small">
                  <div className="card-body p-2">
                    <h6 className="text-warning mb-2">🧯 Low Stock Items</h6>
                    {summary.low_stock?.length > 0 ? (
                      <ul className="mb-0 small ps-3">
                        {summary.low_stock.map((item, idx) => (
                          <li key={idx}>
                            {item.name} {item.brand && `(${item.brand})`} — <strong>{item.stock_level}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small mb-0">No low stock items.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⏳ Expiring Items */}
          {summary.expiring_soon?.length > 0 && (
            <div className="alert alert-danger small">
              <h6 className="mb-2">⏳ Soon-to-Expire Items</h6>
              <ul className="mb-0 small">
                {summary.expiring_soon.map((item, idx) => (
                  <li key={idx}>
                    {item.name} {item.brand && `(${item.brand})`} — expires on <strong>{item.expiry_date}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* 📊 Top Brands Chart */}
      {summary && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-title">Top 5 Selling Brands</h6>
            {summary.top_items.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.top_items}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand_name" />   {/* ✅ switched from item_name */}
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_qty" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted small mb-0">No sales data available for this date.</p>
            )}
          </div>
        </div>
      )}

      {/* 📈 Monthly Sales Trends */}
      <div className="card">
        <div className="card-body">
          <h6 className="card-title">📈 Monthly Sales Trends (2025)</h6>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted small mb-0">No monthly sales data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
