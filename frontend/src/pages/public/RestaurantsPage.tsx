import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantsApi } from '../../api/restaurants';

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [wilayaId, setWilayaId] = useState(searchParams.get('wilaya_id') || '');
  const [page, setPage] = useState(1);

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: restaurantsApi.getCategories,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['restaurants-list', search, wilayaId, page],
    queryFn: () =>
      restaurantsApi.getRestaurants({
        search: search || undefined,
        wilaya_id: wilayaId ? parseInt(wilayaId) : undefined,
        page,
        limit: 12,
      }),
  });

  const restaurants = data?.data || [];
  const pagination = data?.pagination;
  const wilayas = wilayasData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🍽️ Restaurants</h1>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wilaya</label>
            <select
              value={wilayaId}
              onChange={(e) => setWilayaId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Wilayas</option>
              {wilayas.map((w: any) => (
                <option key={w.id} value={w.id}>
                  {w.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setSearch('');
                  window.location.href = `/restaurants?category_id=${e.target.value}`;
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
              defaultValue=""
            >
              <option value="">All Categories</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading restaurants...</div>
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <div className="text-red-500">Error loading restaurants</div>
        </div>
      )}

      {!isLoading && !isError && restaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No restaurants found</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant: any) => (
          <Link
            key={restaurant.id}
            to={`/restaurants/${restaurant.id}`}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2 className="font-bold text-lg">{restaurant.name}</h2>
                {restaurant.verified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {restaurant.wilaya_name} • {restaurant.address}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-yellow-500 font-bold">
                  ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({restaurant.review_count} reviews)
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {restaurant.price_level === 1 ? '$' : restaurant.price_level === 2 ? '$$' : restaurant.price_level === 3 ? '$$$' : '$$$$'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}