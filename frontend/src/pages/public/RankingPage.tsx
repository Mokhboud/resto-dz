import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { restaurantsApi } from '../../api/restaurants';

export default function RankingPage() {
const [wilayaId, setWilayaId] = useState('');
const [page] = useState(1);

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', wilayaId, page],
    queryFn: () =>
      restaurantsApi.getRankedRestaurants({
        wilaya_id: wilayaId ? parseInt(wilayaId) : undefined,
        page,
        limit: 20,
      }),
  });

  const restaurants = data?.data || [];
  const meta = data?.meta;
  const wilayas = wilayasData?.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">🏆 Restaurant Rankings</h1>
      <p className="text-gray-500 mb-8">
        Bayesian ranking: {meta?.bayesian_min_reviews} minimum reviews • Global average: {meta?.global_average_rating}
      </p>

      <div className="mb-6">
        <select
          value={wilayaId}
          onChange={(e) => setWilayaId(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Wilayas</option>
          {wilayas.map((w: any) => (
            <option key={w.id} value={w.id}>
              {w.name_en}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading rankings...</div>
      ) : (
        <div className="space-y-4">
          {restaurants.map((restaurant: any) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="bg-white border rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition"
            >
              <div className="text-3xl font-bold text-orange-600 w-16 text-center">
                #{restaurant.rank}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{restaurant.name}</h2>
                <p className="text-sm text-gray-500">{restaurant.wilaya_name}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-500">
                  ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">
                  {restaurant.review_count} reviews
                </div>
                <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-1">
                  Score: {restaurant.ranking_score}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}