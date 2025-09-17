import React from "react";

const ProfitLossDetails = ({ details, formatNaira, loading }) => {
  if (loading) return <div className="alert alert-info">Loading details...</div>;
  if (!details || details.length === 0)
    return <div className="alert alert-warning">No records found</div>;
  
  // Totals
  const totalCost = details.reduce((sum, item) => sum + (item.total_cost || 0), 0);
  const totalSales = details.reduce((sum, item) => sum + (item.total_sales || 0), 0);
  const totalProfit = details.reduce((sum, item) => sum + (item.profit || 0), 0);

  return (
    <div className="card p-3">
      <h5>Detailed Transactions</h5>
      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th>Item</th>
            <th>Brand</th>
            <th>Qty</th>
            <th className="text-end">Cost Price</th>
            <th className="text-end">Selling Price</th>
            <th className="text-end">Total Cost</th>
            <th className="text-end">Total Sales</th>
            <th className="text-end">Profit</th>
            <th className="text-end">Margin %</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, idx) => {
            const margin = item.total_sales
              ? ((item.profit / item.total_sales) * 100).toFixed(1)
              : 0;

            // Decide row class based on margin
            let rowClass = "";
            if (margin >= 30) rowClass = "table-success";
            else if (margin <= 10) rowClass = "table-danger";

            return (
              <tr key={idx} className={rowClass}>
                <td>{item.item}</td>
                <td>{item.brand}</td>
                <td>{item.quantity}</td>
                <td className="text-end">{formatNaira(item.cost_price)}</td>
                <td className="text-end">{formatNaira(item.selling_price)}</td>
                <td className="text-end">{formatNaira(item.total_cost)}</td>
                <td className="text-end">{formatNaira(item.total_sales)}</td>
                <td className="text-end">{formatNaira(item.profit)}</td>
                <td className="text-end">{margin}%</td>
              </tr>
            );
          })}
          {/* Totals row */}
          <tr className="fw-bold table-secondary">
            <td colSpan={5} className="text-end">Grand Total</td>
            <td className="text-end">{formatNaira(totalCost)}</td>
            <td className="text-end">{formatNaira(totalSales)}</td>
            <td className="text-end">{formatNaira(totalProfit)}</td>
            <td className="text-end">
              {totalSales ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfitLossDetails;
