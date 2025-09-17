import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const ItemList = ({baseURL, formatNaira}) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    axiosInstance.get(`${baseURL}/items/`)
      .then(response => {
        setItems(response.data); // Update state
      })
      .catch(error => console.error("Error fetching items:", error));
  }, [baseURL]); // Add dependency to ensure it runs when baseURL changes

  return (
    <>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Items List
              <span style={{float:'right'}} className='mb-2'>
                <Link to='/item-create' className='btn btn-primary'> + Add Item</Link>
              </span>
            </h4>
            {/* <p className="card-description"> Add className <code>.table-striped</code></p> */}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Date Created</th>
                    <th>Stock Level</th>
                  </tr>
                </thead>
                <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    {/* <td className="py-1">
                      <img src="../../assets/images/faces-clipart/pic-1.png" alt="image" />
                    </td> */}
                    {/* <td>
                      <div className="progress">
                        <div className="progress-bar bg-success" role="progressbar" style={{width: '25%', ariaValuenow:'25', ariaValuemin:'0', ariaValuemax:"100"}}></div>
                      </div>
                    </td> */}
                    <td>{item.id}</td>
                    <td>{item.name} (<i>{item.brand_name}</i>)</td>
                    <td>{item.item_category}</td>
                    <td>{item.date_created.split('T')[0]}; {(item.date_created.split('T')[1]).split('.')[0]}</td>
                    <td>{item.stock_level}</td>
                    <td><Link to={ `/item-update/${item.id}/` }>
                    <i className="mdi mdi-pencil" title="Edit Item"></i> 
                    </Link></td>
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

export default ItemList