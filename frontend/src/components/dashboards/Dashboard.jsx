// Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = ({ baseURL, formatNaira }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axiosInstance.get(`${baseURL}/reports/dashboard/daily-summary/`)
      .then(res => setSummary(res.data))
      .catch(err => console.error("Failed to fetch dashboard:", err));
  }, [baseURL]);

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h4 className="mb-4">📊 Daily Sales Summary</h4>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card text-white bg-primary p-3">
            <h6>Total Sales</h6>
            <h4>{formatNaira(summary.total_sales)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success p-3">
            <h6>Total Profit</h6>
            <h4>{formatNaira(summary.total_profit)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-dark p-3">
            <h6>Total Transactions</h6>
            <h4>{summary.invoice_count}</h4>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <h6>Top 5 Selling Items Today</h6>
        <ul className="list-group list-group-flush">
          {summary.top_items.map((item, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between">
              <span>{item.item_name}</span>
              <strong>{item.total_qty} sold</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
