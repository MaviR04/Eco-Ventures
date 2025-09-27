// Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; // we'll show a minimal provider below
import { useNavigate, NavLink } from "react-router";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAccessToken, setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

   let navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError(null);
    console.log("yo ts ran")
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await res.json();
    console.log(data);
    navigate("/tours");
    if (!res.ok) {
      setError(data.error || 'Login failed');
    }

    // access token returned in response body; refresh token set in httpOnly cookie
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  return (
<div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-emerald-400 to-cyan-400'>
      <form onSubmit={submit} className="max-w-md mx-auto p-6 shadow-md bg-gray-900 rounded-2xl">
        <h2 className="text-2xl font-raleway font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2 font-dmsans">{error}</div>}
        <label htmlFor="email" className='font-dmsans'>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)}  className="w-full my-2 rounded-2xl p-1 border-gray-300 border-1" />
        <label htmlFor="password" className='font-dmsans'>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className=" font-dmsans w-full my-2 rounded-2xl p-1 border-gray-400 border-1" />
        <button className="px-6 py-2 bg-green-600 text-white rounded-2xl mt-4 cursor-pointer">Login</button>
        <NavLink to="/register"><p className='opacity-70 text-sm mt-5'>No Account? <span className=' underline'>Sign Up Here</span></p></NavLink>
      </form>
</div>
  );
}
