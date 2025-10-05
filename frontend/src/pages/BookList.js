import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

export default function BookList(){
  const [data, setData] = useState({ books: [], page:1, pages:1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');

  const fetchBooks = async (p=1) => {
    try {
      const q = new URLSearchParams();
      q.set('page', p);
      if (search) q.set('search', search);
      if (genre) q.set('genre', genre);
      if (sort) q.set('sort', sort);
      const res = await api.get(`/books?${q.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(()=>{ fetchBooks(page); }, [page, search, genre, sort]);

  return (
    <div>
      <h1>Books</h1>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search by title or author" value={search} onChange={e=>setSearch(e.target.value)} />
        <input placeholder="Genre filter" value={genre} onChange={e=>setGenre(e.target.value)} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="year">Sort: Year</option>
          <option value="rating">Sort: Avg Rating</option>
        </select>
        <button onClick={()=>{ setPage(1); fetchBooks(1); }}>Apply</button>
      </div>

      <div className="list-grid">
        {data.books.map(b=>(
          <div className="card" key={b._id}>
            <h3>{b.title}</h3>
            <p className="small">By {b.author} • {b.year || 'N/A'}</p>
            <p className="small">Genre: {b.genre || 'N/A'}</p>
            <p className="rating">{b.avgRating ? b.avgRating : 'No ratings'}</p>
            <Link to={`/books/${b._id}`}>Details</Link>
          </div>
        ))}
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
