import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
