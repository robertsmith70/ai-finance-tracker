import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate('/');
    } catch {
      setError('Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username"
          value={form.username} onChange={handleChange}
        /><br/>
        <input name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange}
        /><br/>
        <input name="password" type="password" placeholder="Password"
          value={form.password} onChange={handleChange}
        /><br/>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;
