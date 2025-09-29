import { useEffect, useState } from 'react';
import api from '../services/api';

function Expenses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', price:'', category:'' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name:'', price:'', category:'' });
  const [error, setError] = useState(null);

  const load = async () => {
    try { const { data } = await api.get('/expenses'); setItems(data || []); }
    catch { setError('Failed to load expenses'); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/expenses', { ...form, price: Number(form.price) });
      setItems([data, ...items]);
      setForm({ name:'', price:'', category:'' });
    } catch (e) { setError(e?.response?.data?.message || 'Failed to add'); }
  };

  const startEdit = (x) => {
    setEditingId(x._id);
    setEditForm({ name: x.name, price: x.price, category: x.category });
  };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (id) => {
    const payload = { ...editForm, price: Number(editForm.price) };
    const { data } = await api.put(`/expenses/${id}`, payload);
    setItems(items.map(it => it._id === id ? data : it));
    setEditingId(null);
  };

  const remove = async (id) => {
    await api.delete(`/expenses/${id}`);
    setItems(items.filter(x => x._id !== id));
  };

  return (
    <div style={{ maxWidth: 900, margin: '24px auto' }}>
      <h1>Expenses</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={addExpense} style={{ display: 'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap: 8 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={onChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={onChange} />
        <button type="submit">Add</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {items.map(x => (
          <li key={x._id}
              style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap: 8, alignItems:'center', padding:'8px 0', borderBottom:'1px solid #eee' }}>
            {editingId === x._id ? (
              <>
                <input value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} />
                <input type="number" step="0.01" value={editForm.price} onChange={e=>setEditForm({...editForm, price:e.target.value})} />
                <input value={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})} />
                <span>
                  <button onClick={()=>saveEdit(x._id)}>Save</button>{' '}
                  <button onClick={cancelEdit}>Cancel</button>
                </span>
              </>
            ) : (
              <>
                <span>{x.name}</span>
                <span>{x.price}</span>
                <span>{x.category}</span>
                <span>
                  <button onClick={()=>startEdit(x)}>Edit</button>{' '}
                  <button onClick={()=>remove(x._id)}>Delete</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Expenses;
