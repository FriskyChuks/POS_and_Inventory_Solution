import React from "react";

const ProfitLossSummary = ({ summary, formatNaira, loading }) => {
  if (loading) return <div className="alert alert-info">Loading summary...</div>;
  if (!summary) return null;

  return (
    <div className="card mb-3 p-3">
      <div className="row text-center">
        <div className="col-md-4">
          <h6>Total Revenue</h6>
          <h5 className="text-success">{formatNaira(summary.total_revenue)}</h5>
        </div>
        <div className="col-md-4">
          <h6>Total Cost/Expenses</h6>
          <h5 className="text-danger">{formatNaira(summary.total_cost)}</h5>
        </div>
        <div className="col-md-4">
          <h6>Net Profit/Loss</h6>
          <h5 className={summary.total_profit >= 0 ? "text-success" : "text-danger"}>
            {formatNaira(summary.total_profit)}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossSummary;
