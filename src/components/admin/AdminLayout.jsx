import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FolderTree,
  BookOpen,
  Package,
  Menu,
  X,
  LogOut,
  Home,
} from 'lucide-react';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', end: false, label: 'Users', icon: Users },
  { to: '/admin/payments', end: false, label: 'Payments', icon: CreditCard },
  { to: '/admin/resources', end: false, label: 'Resources', icon: FolderTree },
  { to: '/admin/proff', end: false, label: 'Proff', icon: BookOpen },
  { to: '/admin/packages', end: false, label: 'Packages', icon: Package },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - full viewport height (100vh) */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gray-900 text-white flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-700">
            <Link to="/admin" className="flex items-center gap-2 font-heading font-bold text-lg">
              <span className="text-primary">MEDEASE</span>
              <span className="text-gray-400 text-sm">Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 min-h-0">
            {navItems.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-shrink-0 p-3 border-t border-gray-700 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Home className="w-5 h-5" />
              Back to site
            </Link>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-change'));
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </a>
          </div>
        </div>
      </aside>

      {/* Main content - offset by sidebar width */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm text-gray-500 font-body">Admin Panel</p>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
