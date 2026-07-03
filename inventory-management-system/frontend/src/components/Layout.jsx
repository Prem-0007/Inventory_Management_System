import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/reports', label: 'Reports' }
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar glass">
        <div className="brand-row">
          <span className="brand">IMS</span>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>{user?.name}</p>
          <span className="role-badge">{user?.role}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="content">
        <div className="topbar">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
