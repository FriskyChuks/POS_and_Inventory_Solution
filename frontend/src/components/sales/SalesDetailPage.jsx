import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const SalesDetailPage = ({ baseURL, formatNaira }) => {
  const { id } = useParams();
  const [saleDetails, setSaleDetails] = useState(null);
  const [saleSummary, setSaleSummary] = useState(null);

  useEffect(() => {
    axiosInstance.get(`${baseURL}/sales/get_sales_details/${id}/`)
      .then(res => setSaleDetails(res.data))
      .catch(err => console.error("Failed to fetch sale details:", err));
  }, [id, baseURL]);

  useEffect(() => {
    axiosInstance.get(`${baseURL}/sales/get_sales/${id}/`)
      .then(res => setSaleSummary(res.data))
      .catch(err => console.error("Failed to fetch sale summary:", err));
  }, [id, baseURL]);

  if (!saleDetails || !saleSummary) return <p>Loading...</p>;

  const total = saleDetails.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    const discount = parseFloat(item.discount) || 0;
    return sum + (qty * price - discount);
  }, 0);
  
  const itemDiscountTotal = saleDetails.reduce((sum, item) => {
    const discount = parseFloat(item.discount) || 0;
    return sum + discount;
  }, 0);
  
  const saleDiscount = parseFloat(saleSummary[0]?.sales_discount) || 0;
  const totalDiscount = itemDiscountTotal + saleDiscount;

  return (
    <>
      {saleDetails===null ? <div></div> :
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Sales Detail
              <span style={{ float: 'right' }} className="mb-2">
                <Link to="/sales-history" className="btn btn-primary"> Sales List</Link>
              </span>
            </h4>

            <p className="card-description mb-0">INVOICE NO: <span>{saleDetails[0].sales_info.invoice_number}</span></p>
            <p className="card-description mb-0">Customer: <span>{saleDetails[0].sales_info.customer || 'Anonymous'}</span></p>
            <p className="card-description mb-0">Phone: <span>{saleDetails[0].sales_info.phone || 'NIL'}</span></p>
            <p className="card-description">
              Date: <span>{saleDetails[0].sales_info.date ? new Date(saleDetails[0].sales_info.date).toLocaleDateString() : 'NIL'}</span>
            </p>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item/Brand</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetails.map(detail => (
                    <tr key={detail.id}>
                      <td>{detail.id}</td>
                      <td>{detail.item_info.name} ({detail.item_info.brand})</td>
                      <td>{detail.quantity}</td>
                      <td>{formatNaira(detail.unit_price)}</td>
                      <td>{formatNaira(detail.discount)}</td>
                      <td>{formatNaira(detail.quantity * detail.unit_price - detail.discount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table> <br />

              <div className="row g-2">
                <div className="col-md-12">
                  <label style={{ float: 'left' }}>Item Discounts:</label>
                  <label style={{ float: 'right', fontSize: 'x-large' }}>
                    {formatNaira(itemDiscountTotal)}
                  </label>
                </div>
                <div className="col-md-12">
                  <label style={{ float: 'left' }}>Sales Discount:</label>
                  <label style={{ float: 'right', fontSize: 'x-large' }}>
                    {formatNaira(saleSummary[0]?.sales_discount || 0)}
                  </label>
                </div>
                <div className="col-md-12">
                  <label style={{ float: 'left' }}><strong>Total Discount:</strong></label>
                  <label style={{ float: 'right', fontSize: 'x-large' }}>
                    <strong>{formatNaira(totalDiscount)}</strong>
                  </label>
                </div>
                <div className="col-md-12">
                  <label style={{ float: 'left' }}><strong> Sales Total:</strong></label>
                  <label style={{ float: 'right', fontSize: 'x-large' }}>
                    <strong>{formatNaira(saleSummary[0]?.total?.total || total)}</strong>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default SalesDetailPage;
