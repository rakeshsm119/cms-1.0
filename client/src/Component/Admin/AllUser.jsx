import React,{ useEffect,useState,useContext} from 'react'
import {DataContext, DateContext} from '../../GlobalContext'
import { toast } from 'react-toastify'
import axios from 'axios'


function AllUser() {
    const context = useContext(DataContext)
    const token = context.token
    const [users,setUsers] = useState([])

    const readUsers = async () => {
        const res = await axios.get('/api/v1/user/allUser', {
            headers: { Authorization: token }
        })
        console.log('all users =',res.data)
        setUsers(res.data.users)
    }

    useEffect(() => {
        readUsers()
    },[])

    const handleUpdate = (id) => {
        console.log('id =',id)
    }
  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12 text-center">
                <h3 className="display-3 text-success">All Users</h3>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12 table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr className='text-center'>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Role</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((item,index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name }</td>
                                        <td>{item.email }</td>
                                        <td>{item.mobile }</td>
                                        <td>{item.role }</td>
                                        <td>
                                            <img src={item.image.url} alt="no Image Found" className="img-fluid" width={100} height={100}/>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <button onClick={() => handleUpdate(item._id)} data-bs-toggle="modal" data-bs-target="#updateRole" className="btn btn-info"><i className="bi bi-pen"></i></button>
                                                <button className="btn btn-danger"><i className="bi bi-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        {/*add modal */}
        {/*end of modal */}
        <div className="modal fade" id='updateRole' tabIndex={"-1"}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title fs-5" id="updateRoleLabel">Update Role</h3>
                        <button type='button' data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body">
                        <form autoComplete="off">
                            <div className="form-group mt-2">
                                <label htmlFor="role">Choose Role</label>
                                <select name="role" id="role" className="form-select">
                                    <option value="student">Student</option>
                                    <option value="trainer">Trainer</option>
                                </select>
                            </div>
                            <div className="form-group mt-2">
                                <input type="submit" value="Update" className="btn btn-warning" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer"></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AllUser