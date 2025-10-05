import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BookDetails(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [dist, setDist] = useState(null);
  const [review, setReview] = useState({ rating:5, reviewText: '' });
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setData(res.data);
    } catch (err) { console.error(err); }
  };
  const fetchDistribution = async () => {
    try {
      const res = await api.get(`/books/${id}/ratings/distribution`);
      setDist(res.data.distribution);
    } catch (err) { console.error(err); }
  };
  useEffect(()=>{ fetchDetails(); fetchDistribution(); }, [id]);

  const submitReview = async () => {
    try {
      await api.post(`/reviews/${id}`, review);
      setReview({ rating:5, reviewText:'' });
      fetchDetails(); fetchDistribution();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding review');
    }
  };

  if (!data) return <div>Loading...</div>;
  const chartData = dist ? [5,4,3,2,1].map(k => ({ rating: k, count: dist[String(k)] || 0 })) : [];
  return (
    <div>
      <div className="card">
        <h2>{data.book.title}</h2>
        <p className="small">By {data.book.author}</p>
        <p>{data.book.description}</p>
        <p>Average Rating: {data.avgRating ?? 'N/A'} ({data.reviewsCount})</p>
        {user && String(user._id) === String(data.book.addedBy) && <Link to={`/edit/${data.book._id}`}>Edit Book</Link>}
      </div>

      <div style={{marginTop:12}}>
        <h3>Reviews</h3>
        {data.reviews.length === 0 && <p>No reviews yet</p>}
        {data.reviews.map(r=>(
          <div key={r._id} className="card" style={{marginBottom:8}}>
            <strong>{r.userId.name}</strong> <span className="small">• {r.rating} ⭐</span>
            <p>{r.reviewText}</p>
          </div>
        ))}
      </div>

      <div style={{marginTop:12}} className="card">
        {user ? (
          <>
            <h4>Add / Update Review</h4>
            <select value={review.rating} onChange={e=>setReview({...review, rating: Number(e.target.value)})}>
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea placeholder="Your review" value={review.reviewText} onChange={e=>setReview({...review, reviewText: e.target.value})} />
            <button onClick={submitReview}>Submit Review</button>
          </>
        ) : <p>Please login to add a review.</p>}
      </div>

      <div style={{marginTop:12}} className="card">
        <h3>Rating Distribution</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="small">No rating distribution yet.</p>}
      </div>
    </div>
  );
}
