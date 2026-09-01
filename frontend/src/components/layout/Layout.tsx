import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import NotificationBell from '../notifications/NotificationBell';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-orange-600">
              🇩🇿 Resto DZ
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/restaurants" className="text-gray-700 hover:text-orange-600">
                Restaurants
              </Link>
              <Link to="/ranking" className="text-gray-700 hover:text-orange-600">
                Top Ranked
              </Link>
              {isAuthenticated && (
                <Link to="/favorites" className="text-gray-700 hover:text-orange-600">
                  Favorites
                </Link>
              )}
              {isAuthenticated && user?.roles?.some(r => ['RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(r)) && (
                <Link to="/owner" className="text-gray-700 hover:text-orange-600">
                  Owner Dashboard
                </Link>
              )}
              {isAuthenticated && user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(r)) && (
                <Link to="/admin" className="text-gray-700 hover:text-orange-600">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <Link to="/profile" className="text-sm text-gray-700 hover:text-orange-600">
                    {user?.first_name} {user?.last_name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-700 hover:text-orange-600">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          🇩🇿 Resto DZ — Discover. Taste. Rate. Trust.
        </div>
      </footer>
    </div>
  );
}