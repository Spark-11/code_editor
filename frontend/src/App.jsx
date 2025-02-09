import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Nopage from './pages/Nopage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Edit from './pages/Edit'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <RouteHandler />
      </BrowserRouter>
    </>
  )
}
const RouteHandler = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return (
    <>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="*" element={<Nopage />} />
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/edit/:id' element={isLoggedIn ? <Edit /> : <Navigate to={"/login"} />}/>
      </Routes>
    </>
  ) 
}

export default App