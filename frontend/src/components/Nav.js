import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Nav(){
  const [dark, setDark] = useState(()=> localStorage.getItem('dark') === 'true');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(()=>{
    document.body.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('dark', dark ? 'true' : 'false');
  }, [dark]);

  return (
    <div className="nav">
      <div style={{flex:1}}>
        <Link to="/">Home</Link> | <Link to="/add">Add Book</Link>
      </div>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <button onClick={()=>setDark(d=>!d)} style={{padding:'6px 8px'}}>{dark ? '🌙 Dark' : '🌤️ Light'}</button>
        {user ? <span className="small">Hi, {user.name}</span> : (<><Link to="/login">Login</Link> | <Link to="/signup">Signup</Link></>)}
      </div>
    </div>
  );
}
