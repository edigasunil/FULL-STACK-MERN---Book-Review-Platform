import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
export default function AddEditBook(){
  const { id } = useParams();
  const [form, setForm] = useState({ title:'', author:'', description:'', genre:'', year:'' });
  const navigate = useNavigate();

  useEffect(()=>{
    if (id) {
      api.get(`/books/${id}`).then(res=>{
        const b = res.data.book;
        setForm({ title: b.title, author: b.author, description: b.description||'', genre: b.genre||'', year: b.year||'' });
      }).catch(()=>{});
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) await api.put(`/books/${id}`, form);
      else await api.post('/books', form);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card">
      <h2>{id ? 'Edit' : 'Add'} Book</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input placeholder="Author" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} required />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input placeholder="Genre" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})} />
        <input placeholder="Published Year" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} />
        <button type="submit">{id ? 'Update' : 'Add'} Book</button>
      </form>
    </div>
  );
}
