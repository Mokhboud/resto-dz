import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import HomePage from './pages/public/HomePage';
import RestaurantsPage from './pages/public/RestaurantsPage';
import RestaurantDetailsPage from './pages/public/RestaurantDetailsPage';
import RankingPage from './pages/public/RankingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import FavoritesPage from './pages/user/FavoritesPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

const queryClient = new QueryClient();

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="owner" element={<OwnerDashboardPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;