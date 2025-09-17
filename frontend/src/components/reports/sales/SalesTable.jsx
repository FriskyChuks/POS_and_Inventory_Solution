import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const SalesTable = ({ sales, formatNaira, onPrint }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (saleId) => {
    setExpandedRows((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId]
    );
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm align-middle">
        <thead className="table-light">
          <tr className="small text-nowrap">
            {/* <th></th> */}
            <th>#</th>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Salesperson</th>
            <th>Total Items</th>
            <th>Sales Discount</th>
            <th>Total Amount</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sales.length > 0 ? (
            sales.map((sale, index) => (
              <>
                <tr key={sale.id}>
                  <td><button
                      className="btn btn-sm btn-link"
                      onClick={() => toggleRow(sale.id)}
                    >
                      {expandedRows.includes(sale.id) ? '−' : '+'}
                    </button></td>
                  <td>{sale.invoice_number}</td>
                  <td>{format(new Date(sale.sale_date), "dd MMMM yyyy, hh:mm a")}</td>
                  <td>{sale.customer || 'Walk-in'}</td>
                  <td>
                    {sale.cashier
                      ? `${sale.cashier.firstname || ''} ${sale.cashier.lastname || ''}`.trim() ||
                        sale.cashier.email ||
                        '-'
                      : '-'}
                  </td>
                  <td>{sale.items?.length || 0}</td>
                  <td>{formatNaira(sale.total?.discount_total || 0)}</td>
                  <td>{formatNaira(sale.total?.total || 0)}</td>
                  <td>
                    {sale.payments?.length > 0 ? (
                      sale.payments.map((p, idx) => (
                        <div key={idx}>
                          {p.method} – {formatNaira(p.amount || 0)}
                        </div>
                      ))
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {/* <Link to={`/sales-detail/${sale.id}`} className="btn btn-sm btn-primary me-2">
                      <i className="mdi mdi-eye-outline"></i>
                    </Link> */}
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onPrint(sale.id)}
                    >
                      <i className="mdi mdi-printer"></i>
                    </button>
                  </td>
                </tr>

                {expandedRows.includes(sale.id) && (
                  <tr>
                    <td></td>
                    <td colSpan="10">
                      <table className="table table-bordered table-sm mb-0" style={{ color: '#530404ff', fontStyle: 'italic' }}>
                        <thead className="table-light">
                          <tr className="small">
                            <th>Brand</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items?.map((detail) => (
                            <tr key={detail.id}>
                              <td>{detail.brand_info?.brand_name || '-'}</td>
                              <td>{detail.brand_info?.item_name || '-'}</td>
                              <td>{detail.quantity}</td>
                              <td>{formatNaira(detail.unit_price || 0)}</td>
                              <td>{formatNaira(detail.discount || 0)}</td>
                              <td>
                                {formatNaira(
                                  (detail.quantity * detail.unit_price) - (detail.discount || 0)
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center small py-3">
                No sales found for selected criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
