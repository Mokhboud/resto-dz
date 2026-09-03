import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import NotificationBell from '../notifications/NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
              {t('app.name')}
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/restaurants" className="text-gray-700 hover:text-orange-600 text-sm">
                {t('nav.restaurants')}
              </Link>
              <Link to="/ranking" className="text-gray-700 hover:text-orange-600 text-sm">
                {t('nav.topRanked')}
              </Link>
              {isAuthenticated && (
                <Link to="/favorites" className="text-gray-700 hover:text-orange-600 text-sm">
                  {t('nav.favorites')}
                </Link>
              )}
              {isAuthenticated && user?.roles?.some(r => ['RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(r)) && (
                <Link to="/owner" className="text-gray-700 hover:text-orange-600 text-sm">
                  {t('nav.ownerDashboard')}
                </Link>
              )}
              {isAuthenticated && user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(r)) && (
                <Link to="/admin" className="text-gray-700 hover:text-orange-600 text-sm">
                  {t('nav.admin')}
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <Link to="/profile" className="text-sm text-gray-700 hover:text-orange-600 hidden md:block">
                    {user?.first_name} {user?.last_name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-700 hover:text-orange-600">
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                  >
                    {t('nav.register')}
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
          {t('footer.text')}
        </div>
      </footer>
    </div>
  );
}