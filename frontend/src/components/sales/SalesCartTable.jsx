import React, { useState } from 'react';

const SalesCartTable = ({ items, onUpdateItem, onRemoveItem, formatNaira }) => {
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [pendingQty, setPendingQty] = useState(null); // { index, value, max }

  const handleChange = (index, field, value) => {
    const updatedItem = { ...items[index], [field]: value };
    onUpdateItem(index, updatedItem);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle text-nowrap">
        <thead className="table-light">
          <tr className="text-center small">
            <th>#</th>
            <th style={{ minWidth: '250px' }}>Brand (Item)</th>
            <th style={{ width: '80px' }}>Qty</th>
            <th style={{ width: '150px' }}>Price</th>
            <th style={{ width: '120px' }}>Discount</th>
            <th>Subtotal</th>
            <th style={{ width: '50px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan="7" className="text-center small">No items in cart.</td></tr>
          )}

          {items.map((item, index) => {
            const subtotal = (parseFloat(item.qty || 0) * parseFloat(item.price || 0)) - parseFloat(item.discount || 0);

            return (
              <tr key={index} className="align-middle" style={{ fontSize: '0.85rem' }}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <strong>{item.brand || '—'}</strong>{' '}
                  {item.name && (
                    <span className="badge bg-secondary text-light ms-1" style={{ fontSize: '0.7rem' }}>
                      {item.name}
                    </span>
                  )}
                  <span className={`badge ${item.stock < 5 ? 'bg-danger' : 'bg-info'} text-light ms-2`} title="Available stock" style={{ fontSize: 'xx-small' }}>
                    Stock: {item.stock}
                  </span>
                </td>
                <td>
                  <input type="number" className="form-control form-control-sm" value={item.qty} min={1}
                    onChange={(e) => {
                      const inputQty = parseInt(e.target.value, 10) || 1;
                      if (item.stock !== undefined && inputQty > item.stock) {
                        setPendingQty({ index, value: inputQty, max: item.stock });
                        setShowQtyModal(true);
                      } else {
                        handleChange(index, 'qty', inputQty);
                      }
                    }}
                    style={{ height: '30px', width: '100px' }}
                  />
                </td>
                <td className="text-end">{formatNaira(item.price)}</td>
                <td>
                  <input type="number" className="form-control form-control-sm" value={item.discount}
                    onChange={(e) => handleChange(index, 'discount', e.target.value)} style={{ height: '30px', width: '120px' }} />
                </td>
                <td className="text-end">{formatNaira(subtotal)}</td>
                <td className="text-center">
                  <button onClick={() => onRemoveItem(index)} className="btn btn-sm btn-danger">&times;</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Quantity Exceeds Modal */}
      {showQtyModal && pendingQty && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-warning">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Quantity Exceeds Stock</h5>
                <button type="button" className="btn-close" onClick={() => setShowQtyModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-2">You've entered a quantity of <strong>{pendingQty.value}</strong>,</p>
                <p className="mb-3">but only <strong>{pendingQty.max}</strong> is available in stock.</p>
                <p>Do you want to proceed with a negative stock balance?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary btn-sm" onClick={() => { handleChange(pendingQty.index, 'qty', pendingQty.max); setShowQtyModal(false); }}>No, Reset to Max</button>
                <button className="btn btn-success btn-sm" onClick={() => { handleChange(pendingQty.index, 'qty', pendingQty.value); setShowQtyModal(false); }}>Yes, Proceed Anyway</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCartTable;
