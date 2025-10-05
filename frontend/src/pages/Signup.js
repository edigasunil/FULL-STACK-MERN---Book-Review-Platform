import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
