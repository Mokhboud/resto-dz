import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';

export default function OwnerDashboardPage() {
  const { user } = useAuthStore();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/owner/dashboard');
      return response.data;
    },
  });

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['owner-restaurants'],
    queryFn: async () => {
      const response = await apiClient.get('/owner/restaurants');
      return response.data;
    },
  });

  const stats = dashboardData?.data;
  const restaurants = restaurantsData?.data || [];

  // Role check
  const isOwner = user?.roles?.some(r => ['RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(r));

  if (!isOwner) {
    return (
      <div className="text-center py-12 text-red-500">
        You don't have permission to access this page.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🏪 Owner Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.restaurants_count}</div>
            <div className="text-sm text-gray-500">Restaurants</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.total_reviews}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.average_rating}</div>
            <div className="text-sm text-gray-500">Avg Rating</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.total_favorites}</div>
            <div className="text-sm text-gray-500">Favorites</div>
          </div>
        </div>
      )}

      {/* My Restaurants */}
      <h2 className="text-xl font-bold mb-4">My Restaurants</h2>
      {restaurants.length === 0 ? (
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
          You don't have any restaurants yet.
        </div>
      ) : (
        <div className="space-y-4">
          {restaurants.map((restaurant: any) => (
            <div key={restaurant.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500">Status: {restaurant.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-yellow-500">⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}</div>
                  <div className="text-sm text-gray-500">{restaurant.review_count} reviews</div>
                </div>
              </div>
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="inline-block mt-3 text-orange-600 hover:underline text-sm"
              >
                View public page →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
