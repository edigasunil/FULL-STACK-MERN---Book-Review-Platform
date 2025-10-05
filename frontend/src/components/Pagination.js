import React from 'react';
export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({length: pages}, (_,i)=>i+1);
  return (
    <div style={{marginTop:12}}>
      {nums.map(n=>(
        <button key={n} onClick={()=>onChange(n)} disabled={n===page} style={{marginRight:6}}>
          {n}
        </button>
      ))}
    </div>
  );
}
