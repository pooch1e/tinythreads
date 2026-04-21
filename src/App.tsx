import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/wardrobe', label: 'Wardrobe', icon: '👗' },
  { to: '/build',    label: 'Build',    icon: '✨' },
  { to: '/outfits',  label: 'Outfits',  icon: '📸' },
];

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
