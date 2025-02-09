import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import logo2 from '../images/logo2.png'
import { toast } from "react-toastify";
import { api_base_url } from "./helper";
const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + '/signUp',{
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      
      },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        password: password
      })
    }).then(res => res.json()).then(data =>{
      if(data.success){
        navigate('/')
      }
      else{
        toast.error(data.msg)
      }
    })
  };
  return (
    <>
      <div className="con flex flex-col items-center justify-center min-h-screen bg-zinc-900">
        <form onSubmit={submitForm} className="w-[20vw] h-[70vh] flex flex-col items-center bg-zinc-800 rounded-lg shadow-xl shadow-black/50">
          <img className="w-[150px] h-[150px]" src={logo2} alt="" />
          <h3 className="text-2xl font-bold mb-2.5">Sign Up</h3>
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} className="outline-none mb-2 bg-zinc-700 px-3 py-2 rounded-sm" type="text" name="" placeholder="Full name" required/>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className="outline-none mb-2 bg-zinc-700 px-3 py-2 rounded-sm" type="email" name="" placeholder="Email" required/>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className="outline-none mb-2 bg-zinc-700 px-3 py-2 rounded-sm" type="password" name="" placeholder="Password" required/>
          <button className=" mt-4 w-[67%] bg-blue-500 px-3 py-2 rounded-sm cursor-pointer hover:bg-blue-600" type="submit">Create Account</button>
          <p className="text-sm mt-4 text-zinc-400">Already have an account ? <Link className="text-blue-500" to='/login'>Login</Link></p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
