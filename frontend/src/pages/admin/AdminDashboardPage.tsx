import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },
  });

  const stats = data?.data;

  const isAdmin = user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(r));

  if (!isAdmin) {
    return (
      <div className="text-center py-12 text-red-500">
        You don't have permission to access this page.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading admin dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🛡️ Admin Dashboard</h1>
        <Link
          to="/admin/analytics"
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
        >
          📊 View Analytics
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.total_users}</div>
          <div className="text-sm text-gray-500">Users</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats?.total_restaurants}</div>
          <div className="text-sm text-gray-500">Restaurants</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats?.pending_restaurants}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats?.verified_restaurants}</div>
          <div className="text-sm text-gray-500">Verified</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats?.total_reviews}</div>
          <div className="text-sm text-gray-500">Reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Pending Claims</div>
          <div className="text-2xl font-bold">{stats?.pending_claims}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Pending Reports</div>
          <div className="text-2xl font-bold">{stats?.pending_reports}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Deleted Restaurants</div>
          <div className="text-2xl font-bold">{stats?.deleted_restaurants}</div>
        </div>
      </div>
    </div>
  );
}