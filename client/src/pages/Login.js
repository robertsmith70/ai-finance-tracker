import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;
