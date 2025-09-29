import { useState } from 'react';
import api from '../services/api';

export default function InsightsPanel() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    setLoading(true); setErr(null);
    try {
      const { data } = await api.get('/insights');
      setTips(Array.isArray(data?.tips) ? data.tips : []);
    } catch (e) {
      setErr('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{border:'1px solid #eee', borderRadius:8, padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>AI Budgeting Insights</h3>
        <button onClick={run} disabled={loading}>{loading ? 'Thinking…' : 'Generate'}</button>
      </div>
      {err && <p style={{color:'red'}}>{err}</p>}
      <ul style={{marginTop:12}}>
        {tips.map((t,i)=>(<li key={i}>{t}</li>))}
      </ul>
    </div>
  );
}
