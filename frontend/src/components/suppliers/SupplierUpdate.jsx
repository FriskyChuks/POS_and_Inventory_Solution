import { useParams, useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance";
import Message from '../effects/Message';

const SupplierUpdate = ({ baseURL }) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
        name:'', phone1:'', phone2:'', email:'', address:''
    })
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(()=>{
    axiosInstance.get(`${baseURL}/accounts/supplier-update/${id}`).then(res=>setFormData(res.data))
  }, [])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleUpdate = (e)=>{
    e.preventDefault()
    try {
        axiosInstance.patch(`${baseURL}/accounts/supplier-update/${id}/`, formData)
        setMessage({text: 'Supplier Information updated successfully', type:'success'})
        navigate('/supplier-list')

    }catch(err){
        setMessage({text: 'Error updating Supplier Information', type:'error'})
    }
  }

  return (
    <>
      <Message text={message.text} type={message.type} />
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">
            <i className="mdi mdi-pencil" title="Edit Item"></i> Update Supplier Information
            </h4>
            <hr />
            {/* <p className="card-description">Basic form elements</p> */}
            <form className="forms-sample row g-3" onSubmit={handleUpdate}>
              <div className="form-group col-md-12">
                <label htmlFor="exampleInputName1">Name</label> 
                <input type="text" className="form-control" name='name' id="exampleInputName1" placeholder="Name" 
                value={formData.name} onChange={handleChange} required/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="exampleInputPassword4">Phone 1</label>
                <input type="text" name='phone1' className="form-control" id="exampleInputPassword4" placeholder="Phone 1" 
                value={formData.phone1} onChange={handleChange} required/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="exampleInputPassword4">Phone 2</label>
                <input type="text" name='phone2' className="form-control" id="exampleInputPassword4" placeholder="Phone 2" 
                value={formData.phone2} onChange={handleChange} />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="exampleInputPassword4">Email</label>
                <input type="email" name='email' className="form-control" id="exampleInputPassword4" placeholder="Email" 
                value={formData.email} onChange={handleChange} required/>
              </div>
              <div class="form-group col-md-12">
                <label for="exampleTextarea1">Address</label>
                    <textarea class="form-control" name='address' rows="4"
                    value={formData.address} onChange={handleChange} />
                </div>
              <div className='form-group col-md-6'>
                <button type="submit" className="btn btn-success mr-2"> Update Supplier Info </button>
                <Link to="/supplier-list" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SupplierUpdate