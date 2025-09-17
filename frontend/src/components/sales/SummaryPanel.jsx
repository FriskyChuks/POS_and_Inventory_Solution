import React from 'react';

const SummaryPanel = ({ items, formatNaira, globalDiscount, setGlobalDiscount, onSubmit }) => {
  const totalItems = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);

  const itemTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    return sum + (qty * price - discount);
  }, 0);

  const finalTotal = itemTotal - (parseFloat(globalDiscount) || 0);

  return (
    <div className="card p-3 mt-4">
      <div className="row mb-2 align-items-end">
        <div className="col-md-2">
          <label className="form-label small">Total Items</label>
          <h5>{totalItems}</h5>
        </div>
        <div className="col-md-3">
          <label className="form-label small">Sales Discount</label>
          <input type="number" value={globalDiscount} onChange={(e) => setGlobalDiscount(e.target.value)} className="form-control form-control-sm text-end" placeholder="0.00" min="0" />
        </div>
        <div className="col-md-3">
          <label className="form-label small">Subtotal</label>
          <h5><strong>{formatNaira(itemTotal)}</strong></h5>
        </div>
        <div className="col-md-4">
          <label className="form-label small">Total Payable</label>
          <h3><strong>{formatNaira(finalTotal)}</strong></h3>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button className="btn btn-sm btn-warning">Save Draft</button>
        <button className="btn btn-sm btn-primary">Print Invoice</button>
        <button className="btn btn-sm btn-success" onClick={onSubmit}>Complete Sale</button>
      </div>
    </div>
  );
};

export default SummaryPanel;
