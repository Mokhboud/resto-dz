import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { restaurantsApi } from '../../api/restaurants';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => restaurantsApi.getFavorites(),
  });

  const removeMutation = useMutation({
    mutationFn: (restaurantId: string) => restaurantsApi.removeFavorite(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const favorites = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">❤️ My Favorites</h1>

      {isLoading ? (
        <div className="text-center py-12">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't added any restaurants to favorites yet.
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav: any) => (
            <div key={fav.restaurant_id} className="bg-white border rounded-lg p-6 flex items-center justify-between">
              <Link to={`/restaurants/${fav.restaurant_id}`} className="flex-1">
                <h2 className="font-bold text-lg">{fav.name}</h2>
                <p className="text-sm text-gray-500">{fav.wilaya_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">⭐ {parseFloat(fav.avg_rating || '0').toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({fav.review_count} reviews)</span>
                </div>
              </Link>
              <button
                onClick={() => removeMutation.mutate(fav.restaurant_id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}