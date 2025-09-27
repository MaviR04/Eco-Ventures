// Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError(null);
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include' // not necessary for register but ok
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Register failed');
    else {
      alert('Registered! You can now log in.');
      navigate('/login');
    }
  };

  return (
<div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-emerald-400 to-cyan-400'>
      <form onSubmit={submit} className="max-w-md mx-auto p-6 shadow-md bg-gray-900 rounded-2xl">
        <h2 className="text-2xl font-raleway font-bold mb-4 text-white">Register</h2>
        {error && <div className="text-red-500 mb-2 font-dmsans">{error}</div>}
        <label htmlFor="name" className='font-dmsans text-white'>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)}  className="w-full my-2 rounded-2xl p-1 border-gray-300 border-1" />
        <label htmlFor="email" className='font-dmsans text-white'>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)}  className="w-full my-2 rounded-2xl p-1 border-gray-300 border-1" />
        <label htmlFor="password" className='font-dmsans text-white'>Password</label>
         <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className=" font-dmsans w-full my-2 rounded-2xl p-1 border-gray-400 border-1" />
         <button className="px-6 py-2 bg-green-600 text-white rounded-2xl mt-4 cursor-pointer">Register</button>
      </form>
</div>
  );
}
