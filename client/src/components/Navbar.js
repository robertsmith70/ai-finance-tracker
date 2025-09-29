import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/expenses">Expenses</Link> |{" "}
      {!user ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
