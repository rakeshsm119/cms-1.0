import React,{ useContext} from 'react'
import { BrowserRouter as Router,Navigate, Route,Routes } from 'react-router-dom'
import { DataContext } from '../GlobalContext'
import ProtectedRoute from '../Middleware/ProtectedRoute'
import history from '../Middleware/History'

import { ToastContainer } from 'react-toastify'

import Menu from './Header/Menu'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Home from './Default/Home'
import About from './Default/About'
import Contact from './Default/Contact'
import Pnf from './Util/Pnf'
import AdminProfile from './Admin/AdminProfile'
import AdminDashboard from './Admin/AdminDashboard'
import StudentProfile from './Student/StudentProfile'
import StudentDashboard from './Student/StudentDashboard'
import TrainerProfile from './Trainer/TrainerProfile'
import TrainerDashboard from './Trainer/TrainerDashboard'
import AllUser from './Admin/AllUser'


function Main() {
  const context = useContext(DataContext)
  const [isLogged] = context.data.authApi.isLogged
  const [ isAdmin] = context.data.authApi.isAdmin
  const [ isStudent] = context.data.authApi.isStudent
  const [ isTrainer] = context.data.authApi.isTrainer

  return (
    <Router history={history}>
        <Menu />
        <ToastContainer autoClose={5000} position={'top-right'} />
        <Routes>
            <Route path={`/`} element={
              isLogged ? 
              <>
              { isAdmin ? <Navigate to={`/admin/dashboard`} /> : null }
              { isStudent ? <Navigate to={`/student/dashboard`} /> : null }
              { isTrainer ? <Navigate to={`/trainer/dashboard`} /> : null }
              </> : <Home />
            } ></Route>
            <Route path={`/about`} element={ isLogged ? <Navigate to={`/*`} />: <About/>} ></Route>
            <Route path={`/contact`} element={  isLogged ? <Navigate to={`/*`} />:<Contact />} ></Route>
            <Route path={`/login`} element={ isLogged ? <Navigate to={`/*`} />:<Login />} ></Route>
            <Route path={`/register`} element={ isLogged ? <Navigate to={`/*`} />:<Register />} ></Route>
            {
             isLogged && isAdmin ? (
                <Route element={<ProtectedRoute />}>
                    <Route path='/admin/profile' element={<AdminProfile />} />
                    <Route path='/admin/users' element={<AllUser />} />
                    <Route path='/admin/dashboard' element={<AdminDashboard />} />
                </Route>
              ) : null
            }
            {
              isLogged & isStudent ? (
                <Route element={<ProtectedRoute />}>
                    <Route path='/student/profile' element={<StudentProfile />} />
                    <Route path='/student/dashboard' element={<StudentDashboard />} />
                </Route>
              ) : null
            }
            {
             isLogged & isTrainer ? (
                <Route element={<ProtectedRoute />}>
                    <Route path='/trainer/profile' element={<TrainerProfile />} />
                    <Route path='/trainer/dashboard' element={<TrainerDashboard />} />
                </Route>
              ) : null
            }
            <Route path={`/*`} element={<Pnf />} ></Route>
        </Routes>
    </Router>
  )
}

export default Main