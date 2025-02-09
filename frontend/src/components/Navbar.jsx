import React from 'react'
import { Link } from 'react-router-dom'
import homeLogo from '../images/homeLogo.png'
const Navbar = () => {
  return (
    <>
    <div className='nav flex items-center justify-between bg-zinc-800 min-h-16'>
      <div className="left-container flex items-center">
        <img className='h-16' src={homeLogo} alt="" />
        <span className='text-2xl font-bold'>codeBox</span>
      </div>

      <div className="w-2xs right-container flex items-center gap-4">
        <Link className='transistion-all hover:text-blue-500'>Home</Link>
        <Link className='transistion-all hover:text-blue-500'>About</Link>
        <Link className='transistion-all hover:text-blue-500'>Services</Link>
        <Link className='transistion-all hover:text-blue-500'>Contact</Link>
        <button onClick={() =>{
          localStorage.removeItem('token')
          localStorage.removeItem('isLoggedIn')
          window.location.reload()
        }} className='bg-red-500 text-white px-3 py-2 rounded-sm'>Logout</button>
      </div>
    </div>
    </>
  )
}

export default Navbar