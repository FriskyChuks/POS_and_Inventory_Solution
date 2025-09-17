import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const BrandList = ({ baseURL, formatNaira }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axiosInstance.get(`${baseURL}/brands/`)
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => console.error("Error fetching brands:", error));
  }, [baseURL]);

  return (
    <>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Brands List
              <span style={{ float: 'right' }} className='mb-2'>
                <Link to='/brand-create' className='btn btn-primary'> + Add Brand</Link>
              </span>
            </h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Brand</th>
                    <th>Item</th>
                    <th>Stock Level</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Barcode</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(brand => (
                    <tr key={brand.id}>
                      <td>{brand.id}</td>
                      <td>{brand.name}</td>
                      <td>{brand.item_name || '—'}</td>
                      <td>{brand.stock_level}</td>
                      <td>{formatNaira ? formatNaira(brand.cost_price) : brand.cost_price}</td>
                      <td>{formatNaira ? formatNaira(brand.selling_price) : brand.selling_price}</td>
                      <td>{brand.barcode || '—'}</td>
                      <td>{brand.created_at?.split('T')[0]}</td>
                      <td>
                        <Link to={`/brand-update/${brand.id}/`}>
                          <i className="mdi mdi-pencil" title="Edit Brand"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandList;
