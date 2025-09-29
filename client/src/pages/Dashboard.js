import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import InsightsPanel from '../components/InsightsPanel';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function Dashboard() {
  const [allItems, setAllItems] = useState([]);
  const [range, setRange] = useState({ start: '', end: '' }); // yyyy-mm-dd

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/expenses');
      setAllItems(data || []);
    })();
  }, []);

  const items = useMemo(() => {
    if (!range.start && !range.end) return allItems;
    const start = range.start ? new Date(range.start + 'T00:00:00Z') : null;
    const end = range.end ? new Date(range.end + 'T23:59:59Z') : null;
    return allItems.filter(x => {
      const d = new Date(x.date || Date.now());
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [allItems, range]);

  const total = useMemo(
    () => items.reduce((s, x) => s + (Number(x.price) || 0), 0),
    [items]
  );

  const byCategory = useMemo(() => {
    const map = items.reduce((acc, x) => {
      const k = x.category || 'Uncategorized';
      acc[k] = (acc[k] || 0) + Number(x.price || 0);
      return acc;
    }, {});
    return { labels: Object.keys(map), datasets: [{ data: Object.values(map) }] };
  }, [items]);

  const byMonth = useMemo(() => {
    const key = (d) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    };
    const map = items.reduce((acc, x) => {
      const k = key(x.date || Date.now());
      acc[k] = (acc[k] || 0) + Number(x.price || 0);
      return acc;
    }, {});
    const labels = Object.keys(map).sort();
    return { labels, datasets: [{ label: 'Monthly spend', data: labels.map(l => map[l]) }] };
  }, [items]);

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 12px', display: 'grid', gap: 24 }}>
      <h1>Dashboard</h1>

      {/* 🔥 Put InsightsPanel INSIDE the return */}
      <InsightsPanel />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>From: <input type="date" value={range.start} onChange={e => setRange(r => ({ ...r, start: e.target.value }))} /></label>
        <label>To: <input type="date" value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))} /></label>
        <button onClick={() => setRange({ start: '', end: '' })}>Clear</button>
        <div style={{ marginLeft: 'auto' }}>
          Total: <strong>{total.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3>Spend by Category</h3>
          <Doughnut data={byCategory} />
        </div>
        <div>
          <h3>Monthly Trend</h3>
          <Line data={byMonth} options={{ tension: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
