import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import SalesCartTable from './SalesCartTable';
import SummaryPanel from './SummaryPanel';
import Message from '../effects/Message';
import useAuth from '../accounts/useAuth';

const EPSILON = 0.005; // tolerance for floating point comparison

const SalesPage = ({ baseURL, formatNaira }) => {
  const { user } = useAuth();
  const accessToken = localStorage.getItem('access_token');

  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10),
    payment_method: 'cash'
  });

  // payments = [{ method: 'cash'|'pos'|..., amount: number }]
  const [payments, setPayments] = useState([]);

  // --- Totals ---
  const totalPayable = cartItems.reduce(
    (sum, item) => sum + (Number(item.qty) * Number(item.price) - Number(item.discount || 0)),
    0
  ) - (parseFloat(globalDiscount) || 0);

  // Live split total
  const splitTotal = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  // Balanced check with epsilon to avoid floating rounding issues
  const isBalanced = Math.abs((splitTotal || 0) - (totalPayable || 0)) < EPSILON;

  // --- Brand Search (barcode support) ---
  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchTerm.trim();
      if (!q) {
        setSuggestions([]);
        return;
      }

      axiosInstance
        .get(`${baseURL}/brands/search/?search=${encodeURIComponent(q)}`)
        .then(res => {
          const results = res.data || [];

          // If it's a barcode (scanner input) and only one exact match → auto add
          if (results.length === 1 && results[0].barcode?.toString() === q) {
            addItem(results[0]);
            return;
          }

          setSuggestions(results);
        })
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(t);
  }, [searchTerm, baseURL]);

  // --- Cart Operations ---
  const addItem = (brand) => {
    if (!brand) return;
    if (cartItems.some(ci => ci.brandId === brand.id)) {
      setMessage({ text: `${brand.name} is already in the cart`, type: 'error' });
      setSearchTerm('');
      setSuggestions([]);
      return;
    }

    const newItem = {
      brandId: brand.id,
      brand: brand.name || '',
      name: brand.item_name || (brand.item && brand.item.name) || '',
      qty: 1,
      price: brand.selling_price ?? brand.price ?? 0,
      discount: 0,
      stock: brand.stock_level ?? brand.stock ?? 0
    };

    setCartItems(prev => [...prev, newItem]);
    setSearchTerm('');
    setSuggestions([]);
  };

  const updateItem = (index, updatedItem) => {
    const newCart = [...cartItems];
    newCart[index] = updatedItem;
    setCartItems(newCart);
  };

  const removeItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // --- Payments handling & modal lifecycle ---

  // When payment method changes
  const handlePaymentMethodChange = (value) => {
    setCustomer(prev => ({ ...prev, payment_method: value }));

    if (value === 'multiple') {
      // pre-populate payments when modal opens if empty
      if (!payments || payments.length === 0) {
        setPayments([{ method: 'cash', amount: Number(totalPayable) || 0 }]);
      }
      setShowPaymentModal(true);
    } else {
      // single method chosen -> clear any previous split payments
      setPayments([]);
    }
  };

  const handleAddPayment = () => {
    setPayments(prev => [...prev, { method: 'cash', amount: 0 }]);
  };

  const handlePaymentChange = (index, field, rawValue) => {
    setPayments(prev => {
      const copy = [...prev];
      if (field === 'amount') {
        // convert to number; accept empty -> 0
        const num = rawValue === '' ? 0 : Number(rawValue);
        copy[index] = { ...copy[index], amount: isNaN(num) ? 0 : num };
      } else {
        copy[index] = { ...copy[index], [field]: rawValue };
      }
      return copy;
    });
  };

  const handleRemovePayment = (index) => {
    setPayments(prev => prev.filter((_, i) => i !== index));
  };

  // Confirm payments from modal: will open confirmation modal only if balanced
  const handleConfirmPayments = () => {
    if (!isBalanced) {
      setMessage({ text: `Split total must equal invoice total (₦${formatNaira(totalPayable)})`, type: 'error' });
      return;
    }
    setShowPaymentModal(false);
    setShowConfirmModal(true);
  };

  // When user cancels/close payments modal, keep payment_method set to 'multiple' but modal closes;
  // they can re-open by selecting 'multiple' again from dropdown or continuing to submit (we also open it from handleSubmit)
  const handleClosePaymentsModal = () => setShowPaymentModal(false);

  // --- Submit Sale ---
  const submitSale = async () => {
    // final safety check: if multiple, ensure balanced
    if (customer.payment_method === 'multiple' && !isBalanced) {
      setMessage({ text: 'Payments are not balanced. Please ensure sum of payments equals invoice total.', type: 'error' });
      return;
    }

    const payload = {
      customer: customer.name || '',
      customer_phone: customer.phone || '',
      customer_address: customer.address || '',
      sales_discount: parseFloat(globalDiscount) || 0,
      created_by: user.id,
      payment_method: customer.payment_method || 'cash',
      items: cartItems.map(it => ({
        brand: it.brandId,
        quantity: it.qty,
        unit_price: it.price,
        discount: it.discount || 0
      })),
      // include payments: nested structure expected by serializer
      payments: customer.payment_method === 'multiple'
        ? payments.map(p => ({ method: p.method, amount: Number(p.amount) || 0 }))
        : [{ method: customer.payment_method, amount: Number(totalPayable) || 0 }]
    };

    try {
      const res = await axiosInstance.post(`${baseURL}/sales/`, payload, {
        headers: { Authorization: `FRISKYTECH ${accessToken}` }
      });
      const invoiceId = res.data.id;
      setMessage({ text: 'Sales Completed Successfully!', type: 'success' });
      window.open(`${baseURL}/sales/invoice/pdf/${invoiceId}/`, '_blank');

      // reset
      setCartItems([]);
      setPayments([]);
      setCustomer({ name: '', address: '', phone: '', date: new Date().toISOString().slice(0,10), payment_method: 'cash' });
      setGlobalDiscount(0);
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Sale submit err', err);
      const errorMsg = err.response?.data || err.message || 'Submission failed';
      setMessage({ text: `Sale submission failed: ${JSON.stringify(errorMsg)}`, type: 'error' });
      setShowConfirmModal(false);
    }
  };

  const handleSubmit = () => {
    if (!cartItems.length) {
      setMessage({ text: 'No items in cart.', type: 'error' });
      return;
    }
    // If multiple, open payments modal to force split; otherwise open confirm modal
    if (customer.payment_method === 'multiple') {
      // ensure payments exist for editing
      if (!payments || payments.length === 0) {
        setPayments([{ method: 'cash', amount: Number(totalPayable) || 0 }]);
      }
      setShowPaymentModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  return (
    <div>
      <Message text={message.text} type={message.type} />
      <h2 className="mb-1">Sales Page</h2>
      <hr />

      {/* Customer Inputs */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control form-control-sm" placeholder="Customer Name"
            value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control form-control-sm" placeholder="Phone"
            value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control form-control-sm" placeholder="Address"
            value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
        </div>
      </div>

      {/* Search & Payment */}
      <div className='row g-4'>
        <div className="position-relative col-md-8 mb-2" style={{ zIndex: 1050 }}>
          <input type="text"
            placeholder="Search brand, barcode or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && suggestions.length === 1) {
                addItem(suggestions[0]);
              }
            }}
            className="form-control form-control-sm"
          />

          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1050, top: '100%' }}>
              {suggestions.map(brand => (
                <li key={brand.id} onClick={() => addItem(brand)}
                  className="list-group-item list-group-item-action small" style={{ cursor: 'pointer' }}>
                  <strong>{brand.name}</strong>
                  {brand.item_name && <span className="text-muted"> — {brand.item_name}</span>}
                  <span className="float-end">₦{formatNaira(brand.selling_price ?? brand.price ?? 0)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='col-md-1'></div>
        <div className='col-md-1'><label className="form-label small">Payment Method</label></div>
        <div className="col-md-2 mb-4">
          <select className="form-control form-select-sm" value={customer.payment_method}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="pos">POS</option>
            <option value="transfer">Transfer</option>
            <option value="credit">Credit</option>
            <option value="cheque">Cheque</option>
            <option value="multiple">Multiple</option>
          </select>
        </div>
      </div>

      <SalesCartTable items={cartItems} onUpdateItem={updateItem} onRemoveItem={removeItem} formatNaira={formatNaira} />

      <SummaryPanel items={cartItems} formatNaira={formatNaira} globalDiscount={globalDiscount} setGlobalDiscount={setGlobalDiscount} onSubmit={handleSubmit} />

      {/* Payments Modal (normal size, live totals) */}
      {showPaymentModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered"> {/* removed modal-lg */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Split Payments</h5>
                <button type="button" className="btn-close" onClick={handleClosePaymentsModal}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-sm mb-2">
                    <thead>
                      <tr>
                        <th style={{ width: '55%' }}>Method</th>
                        <th style={{ width: '35%' }}>Amount (₦)</th>
                        <th style={{ width: '10%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={i}>
                          <td>
                            <select className="form-select form-select-sm"
                              value={p.method}
                              onChange={(e) => handlePaymentChange(i, 'method', e.target.value)}>
                              <option value="cash">Cash</option>
                              <option value="pos">POS</option>
                              <option value="transfer">Transfer</option>
                              <option value="credit">Credit</option>
                              <option value="cheque">Cheque</option>
                            </select>
                          </td>
                          <td>
                            <input type="number" step="0.01" className="form-control form-control-sm"
                              value={p.amount}
                              onChange={(e) => handlePaymentChange(i, 'amount', e.target.value)} />
                          </td>
                          <td>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemovePayment(i)}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex gap-2 align-items-center mb-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={handleAddPayment}>+ Add Payment</button>
                  <small className="text-muted">You must match the invoice total before confirming.</small>
                </div>

                <div className="border p-2 rounded small">
                  <div><strong>Invoice Total:</strong> ₦{formatNaira(totalPayable)}</div>
                  <div><strong>Split Total:</strong> ₦{formatNaira(splitTotal)}</div>
                  <div><strong>Difference:</strong> ₦{formatNaira((totalPayable - splitTotal) || 0)}</div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={handleClosePaymentsModal}>Cancel</button>
                <button className="btn btn-success btn-sm" onClick={handleConfirmPayments} disabled={!isBalanced}>
                  Confirm Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Sale Modal */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Sale</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>You're about to complete this sale:</p>
                <ul className="list-group mb-3 small">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Items</span>
                    <strong>{cartItems.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Amount Payable</span>
                    <strong>₦{formatNaira(totalPayable)}</strong>
                  </li>

                  {customer.payment_method === 'multiple' && (
                    <li className="list-group-item">
                      <strong>Payments Breakdown</strong>
                      <div className="mt-2">
                        {payments.map((p, i) => (
                          <div key={i} className="small">
                            {p.method}: ₦{formatNaira(p.amount)}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 small">
                        <strong>Split Total:</strong> ₦{formatNaira(splitTotal)}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button className="btn btn-success btn-sm" onClick={submitSale} disabled={customer.payment_method === 'multiple' && !isBalanced}>
                  Yes, Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesPage;
