import React, { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../GlobalContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Loading = () => {
  return <div className='spinner-border text-success' role={'status'} >
    <span className="visually-hidden">Loading... </span>
  </div>
}
function TrainerProfile() {
  const context = useContext(DataContext)
  const token = context.token
  const [currentUser] = context.data.authApi.currentUser


  const [img, setImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const [user,setUser] = useState({
    name: "",
    email:"",
    mobile: ""
  })
  const [isEdit,setIsEdit] = useState(false)

  const readValue = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }

  const toggleEdit = () => {
    setIsEdit((prevState) => !prevState)
  }

  useEffect(() => {
    setImg(currentUser.image)
    setUser(currentUser)
  }, [img, currentUser])

  const updateHandler = async (e) => {
    e.preventDefault()
    try{
      const updateUser = {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
      // console.log('update data =',updateUser)
      await axios.patch(`/api/v1/user/update`, updateUser, {
        headers: { Authorization: token }
      })
      toast.success("Profile image Updated successfully")
      window.location.href = "/trainer/profile"

    }catch(err){
      toast.error(err.response.data.msg)
    }
  }

  //handler upload
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      // console.log('image data =', file)
      //file validation
      if (!file)
        return toast.error('file not exists.. Choose image to upload..')

      //size validation
      if (file.size > 3 * 1024 * 1024)
        return toast.warning("File size must be below 3mb..")

      //append in form constructor
      let formData = new FormData()
      formData.append('profileImg', file)
      setLoading(true)

      // post the image to server
      const res = await axios.post(`/api/v1/image/profileImage/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      })

      //update db file
      await axios.patch(`/api/v1/user/update`, { image: res.data }, {
        headers: { Authorization: token }
      })
      toast.success("Profile image Updated successfully")
      //after upload
      setLoading(false)
      setImg(res.data)
      window.location.href = "/trainer/profile"


    } catch (err) {
      toast.error(err.response.data.msg)
    }
  }

  //handler  delete
  const handleDestroy = async (e) => {
    try {
      if (window.confirm('Are you sure to delete profile image ? ')) {
        setLoading(true)
        await axios.post(`/api/v1/image/profileImage/delete`, { public_id: img.public_id }, {
          headers: {
            Authorization: token
          }
        })
        // update db file
        await axios.patch(`/api/v1/user/update`, { image: { url: "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg" } }, {
          headers: { Authorization: token }
        })
        toast.success("profile image Deleted successfully")

        setImg(false)
        setLoading(false)
        window.location.href = "/trainer/profile"
      }

    } catch (err) {
      toast.error(err.response.data.msg)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h3 className="display-3">Trainer Profile</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="row">
              <div className="col-md-4">
                <div className="card border-0">
                  <div className="position-relative">
                    {
                      img ? (
                        <button onClick={handleDestroy} className="position-absolute top-0 start-100 bg-danger border border-light rounded-circle translate-middle  pt-0 ps-2 pe-2 text-white">X</button>
                      ) : null
                    }
                    {
                      img ? <img src={img ? img.url : " "} alt="No Image Found" className="card-img" /> :
                        <img src={currentUser.image ? currentUser.image.url : " "} alt="No Image Found" className="card-img" />
                    }
                    {
                      loading ? <Loading /> : null
                    }
                  </div>
                  <div className="card-footer">

                      <div className="from-group">
                        <input type="file" name={"profileImg"} id={"profileImg"} className="from-control" required onChange={handleUpload} />
                      </div>

                  </div>
                </div>
              </div>
              <div className="col-md-8">
               {
                isEdit ? (
                  <div className="cart-body">
                    <div className="d-flex justify-content-between">
                  <h4 className="card-title text-center text-uppercase text-success">
                    Update User
                    </h4>
                    <button onClick={toggleEdit} className="btn btn-danger"> <i className="bi bi-x-circle"></i> </button>
                  </div>
                  <hr />
                  <form action="off" onSubmit={updateHandler}>
                    <div className="form-group mt-2">
                      <label htmlFor="name">Name</label>
                      <input type="text" name='name' id='name' value={user.name} onChange={readValue} className="form-control" required />
                    </div>
                    <div className="form-group mt-2">
                      <label htmlFor="email">Email</label>
                      <input type="email" name='email' id='email' value={user.email} onChange={readValue} className="form-control" required />
                    </div>
                    <div className="form-group mt-2">
                      <label htmlFor="mobile">Mobile</label>
                      <input type="number" name='mobile' id='mobile' value={user.mobile} onChange={readValue} className="form-control" required />
                    </div>
                    <div className="form-group mt-2">
                      <input type="submit" value="Update" className='btn btn-warning'  />
                    </div>
                  </form>
                  </div>
                ) : (
                  <div className="card-body">
                  <div className="d-flex justify-content-between">
                  <h4 className="card-title text-center text-uppercase text-success">
                    {currentUser.name}
                    </h4>
                    <button onClick={toggleEdit} className="btn btn-info"> <i className="bi bi-pen"></i> </button>
                  </div>
                  <hr />
                  <p className="card-text">
                    <strong>Email</strong>
                    <strong className="float-end text-danger">{currentUser.email}</strong>
                  </p>
                  <hr />
                  <p className="card-text">
                    <strong>Mobile</strong>
                    <strong className="float-end text-danger">{currentUser.mobile}</strong>
                  </p>
                  <hr />
                  <p className="card-text">
                    <strong>Role</strong>
                    <strong className="float-end text-danger">{currentUser.role}</strong>
                  </p>
                  <hr />
                </div>
                )
               }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerProfile