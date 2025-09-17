import axiosInstance from '../../utils/axiosInstance'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SupplierList = ({ baseURL }) => {
    console.log('Suppliers')
    const [suppliers, setSuppliers] = useState([])

    useEffect(() => {
        axiosInstance.get(`${baseURL}/accounts/suppliers/`).then(res => setSuppliers(res.data));
      }, []);

    
  return (
    <>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Suppliers List
              <span style={{float:'right'}} className='mb-2'>
                <Link to='/supplier-create' className='btn btn-primary'> + Add Supplier</Link>
              </span>
            </h4>
            {/* <p className="card-description"> Add className <code>.table-striped</code></p> */}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>SID</th>
                    <th>Supplier</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.name}</td>
                    <td>{supplier.phone1 } {supplier.phone2 ? '; ' + supplier.phone2: ""} </td>
                    <td>{supplier.email}</td>
                    <td>
                      <Link to={ `/supplier-update/${supplier.id}/` }>
                        <i className="mdi mdi-pencil" title="Update Supplier Info"></i>
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
  )
}

export default SupplierList