import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantsApi } from '../../api/restaurants';
import { useTranslation } from 'react-i18next';

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const search = searchParams.get('search') || '';
  const wilayaId = searchParams.get('wilaya_id') || '';
  const categoryId = searchParams.get('category_id') || '';
  const page = Number(searchParams.get('page') || '1');
  const nearbyMode = searchParams.get('nearby') === 'true';
  const nearbyLat = parseFloat(searchParams.get('lat') || '0');
  const nearbyLng = parseFloat(searchParams.get('lng') || '0');

  const [searchInput, setSearchInput] = useState(search);

  // Sync searchInput when URL search changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: restaurantsApi.getCategories,
  });

  const { data: nearbyData, isLoading: nearbyLoading } = useQuery({
    queryKey: ['nearby-list', nearbyLat, nearbyLng],
    queryFn: () => restaurantsApi.getNearbyRestaurants(nearbyLat, nearbyLng, 20),
    enabled: nearbyMode && nearbyLat > 0 && nearbyLng !== 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants-list', search, wilayaId, categoryId, page],
    queryFn: () =>
      restaurantsApi.getRestaurants({
        search: search || undefined,
        wilaya_id: wilayaId ? parseInt(wilayaId) : undefined,
        category_id: categoryId || undefined,
        page,
        limit: 12,
      }),
    enabled: !nearbyMode,
  });

  const restaurants = nearbyMode
    ? (nearbyData?.data || [])
    : (data?.data || []);
  const pagination = data?.pagination;
  const wilayas = wilayasData?.data || [];
  const categories = categoriesData?.data || [];
  const loading = nearbyMode ? nearbyLoading : isLoading;

  const updateFilters = (
    newSearch?: string,
    newWilayaId?: string,
    newCategoryId?: string
  ) => {
    const params = new URLSearchParams();

    const finalSearch = newSearch !== undefined ? newSearch : search;
    const finalWilayaId = newWilayaId !== undefined ? newWilayaId : wilayaId;
    const finalCategoryId = newCategoryId !== undefined ? newCategoryId : categoryId;

    if (finalSearch.trim()) params.set('search', finalSearch.trim());
    if (finalWilayaId) params.set('wilaya_id', finalWilayaId);
    if (finalCategoryId) params.set('category_id', finalCategoryId);
    params.set('page', '1');

    setSearchParams(params, { replace: true });
  };

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {nearbyMode ? '📍 Near You' : '🍽️ Restaurants'}
      </h1>

      {!nearbyMode && (
        <div className="bg-white border rounded-lg p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      updateFilters(searchInput, undefined, undefined);
                    }
                  }}
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={() => updateFilters(searchInput, undefined, undefined)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Wilaya</label>
              <select
                value={wilayaId}
                onChange={(e) => updateFilters(undefined, e.target.value, undefined)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">All Wilayas</option>
                {wilayas.map((w: any) => (
                  <option key={w.id} value={String(w.id)}>
                    {w.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => updateFilters(undefined, undefined, e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.icon} {c.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(search || wilayaId || categoryId) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-xs text-gray-500">Active filters:</span>
              {search && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  {search}
                  <button onClick={() => { setSearchInput(''); updateFilters('', undefined, undefined); }} className="font-bold hover:text-red-500">×</button>
                </span>
              )}
              {wilayaId && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  {wilayas.find((w: any) => String(w.id) === wilayaId)?.name_en}
                  <button onClick={() => updateFilters(undefined, '', undefined)} className="font-bold hover:text-red-500">×</button>
                </span>
              )}
              {categoryId && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  {categories.find((c: any) => String(c.id) === categoryId)?.name_en}
                  <button onClick={() => updateFilters(undefined, undefined, '')} className="font-bold hover:text-red-500">×</button>
                </span>
              )}
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}, { replace: true }); }}
                className="text-xs text-gray-500 hover:text-red-500 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading restaurants...</div>
        </div>
      )}

      {!loading && restaurants.length === 0 && (
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
                {restaurant.verified && <span className="text-blue-500 text-sm">✓</span>}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {restaurant.wilaya_name} • {restaurant.address}
              </p>
              {restaurant.distance_km && (
                <p className="text-sm text-green-600 mt-1">
                  📏 {parseFloat(restaurant.distance_km).toFixed(1)} km away
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-yellow-500 font-bold">
                  ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">({restaurant.review_count})</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {restaurant.price_level === 1 ? '$' : restaurant.price_level === 2 ? '$$' : restaurant.price_level === 3 ? '$$$' : '$$$$'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!nearbyMode && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => changePage(page + 1)}
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