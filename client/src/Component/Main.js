import React from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'

import Menu from './Header/Menu'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Home from './Default/Home'
import About from './Default/About'
import Contact from './Default/Contact'
import Pnf from './Util/Pnf'


function Main() {
  return (
    <Router>
        <Menu />
        <ToastContainer autoClose={5000} position={'top-right'} />
        <Routes>
            <Route path={`/`} element={<Home />} ></Route>
            <Route path={`/about`} element={<About/>} ></Route>
            <Route path={`/contact`} element={<Contact />} ></Route>
            <Route path={`/login`} element={<Login />} ></Route>
            <Route path={`/register`} element={<Register />} ></Route>
            <Route path={`/*`} element={<Pnf />} ></Route>
        </Routes>
    </Router>
  )
}

export default Main