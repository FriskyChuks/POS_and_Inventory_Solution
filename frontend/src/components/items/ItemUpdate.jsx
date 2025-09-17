import { useParams, useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance";
import Message from '../effects/Message';

const ItemUpdate = ({ baseURL }) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState({ 
     name:'', category:'', brand:'', supplier:'', purchase_price:0.00,
    selling_price:0.00, stock_level:0, manufacture_date:'', expiry_date:''
   });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(()=> {
    axiosInstance.get(`${baseURL}/item-category/`).then(res=>setCategories(res.data))
    },[])

  useEffect(()=>{
    axiosInstance.get(`${baseURL}/accounts/suppliers`).then(res=>setSuppliers(res.data))
  },[])

  useEffect(()=>{
    axiosInstance.get(`${baseURL}/item-update/${id}/`)
    .then(res=>{
      setItem(res.data)
      setIsLoading(false)
    }).catch(err => {
      setMessage({text:'Error fetching Data', type:'error'})
      setIsLoading(false)
    })
  },[baseURL, id])

   // 2️⃣ Handle form changes
   const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 3️⃣ Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`${baseURL}/item-update/${id}/`, item);
      setMessage({text:'Item updated successfully!', type:'success'});
      navigate('/item-list')
    } catch (error) {
      setMessage({text:'Error updating item', type:'error'});
    }
  };

  return (
    <>
      <Message text={message.text} type={message.type} />
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">
            <i className="mdi mdi-pencil" title="Edit Item"></i>Update Item
            </h4>
            {isLoading ? (
                <LoadingSpinner text="Submitting item, please wait..." />
              ) : (
                <form className="forms-sample row g-3" onSubmit={handleUpdate}>
                  <div className="form-group col-md-12">
                    <label htmlFor="exampleInputName1">Name</label> 
                    <input type="text" className="form-control" name='name' id="exampleInputName1" placeholder="Name" 
                    value={item.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleSelectGender">Category</label>
                    <select className="form-control" name="category" value={item.category} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleInputPassword4">Brand</label>
                    <input type="text" name='brand' className="form-control" placeholder="Brand" 
                    value={item.brand} onChange={handleChange} required />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleSelectGender">Supplier</label>
                    <select className="form-control" name="supplier" value={item.supplier} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                    </select>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleInputCity1">Cost Price</label>
                    <input type="number" name='purchase_price' className="form-control" placeholder="Cost Price" 
                    value={item.purchase_price} onChange={handleChange} required />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleInputCity1">Selling Price</label>
                    <input type="number" name='selling_price' className="form-control" placeholder="Selling Price" 
                    value={item.selling_price} onChange={handleChange} required/>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="exampleInputCity1">Stock Level</label>
                    <input type="number" name='stock_level' className="form-control" placeholder="Stock Level" 
                    value={item.stock_level} onChange={handleChange}/>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="exampleInputCity1">Manufacture Date</label>
                    <input type="date" name='manufacture_date' className="form-control" id="exampleInputCity1"
                    value={item.manufacture_date} onChange={handleChange} />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="exampleInputCity1">Expiry Date</label>
                    <input type="date" name='expiry_date' className="form-control" id="exampleInputCity1" 
                    value={item.expiry_date} onChange={handleChange} />
                  </div>
                  <div className='form-group col-md-6'>
                    <button type="submit" 
                      disabled={isLoading}
                      className={isLoading ? 'opacity-50 cursor-not-allowed' : 'btn btn-success mr-2'}
                    > 
                    {isLoading ? 'Please wait...' : 'Update Item'} 
                    </button>
                    <Link to="/item-list" className="btn btn-secondary">Cancel</Link>
                  </div>
                </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemUpdate