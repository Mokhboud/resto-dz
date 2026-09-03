import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { restaurantsApi } from '../../api/restaurants';
import { useTranslation } from 'react-i18next';

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [wilayaId, setWilayaId] = useState(searchParams.get('wilaya_id') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [page, setPage] = useState(1);

  // Nearby mode
  const nearbyMode = searchParams.get('nearby') === 'true';
  const nearbyLat = parseFloat(searchParams.get('lat') || '0');
  const nearbyLng = parseFloat(searchParams.get('lng') || '0');

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: restaurantsApi.getCategories,
  });

  // Query for nearby restaurants
  const { data: nearbyData, isLoading: nearbyLoading } = useQuery({
    queryKey: ['nearby-list', nearbyLat, nearbyLng],
    queryFn: () => restaurantsApi.getNearbyRestaurants(nearbyLat, nearbyLng, 20),
    enabled: nearbyMode && nearbyLat > 0 && nearbyLng !== 0,
  });

  // Query for regular restaurants list
  const { data, isLoading, isError } = useQuery({
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

  // Update URL with combined filters
  const updateFilters = (newSearch?: string, newWilayaId?: string, newCategoryId?: string) => {
    const params = new URLSearchParams();
    
    const finalSearch = newSearch !== undefined ? newSearch : search;
    const finalWilayaId = newWilayaId !== undefined ? newWilayaId : wilayaId;
    const finalCategoryId = newCategoryId !== undefined ? newCategoryId : categoryId;
    
    if (finalSearch) params.set('search', finalSearch);
    if (finalWilayaId) params.set('wilaya_id', finalWilayaId);
    if (finalCategoryId) params.set('category_id', finalCategoryId);
    
    const queryString = params.toString();
    navigate(queryString ? `/restaurants?${queryString}` : '/restaurants');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {nearbyMode ? '📍 Near You' : '🍽️ Restaurants'}
      </h1>
      {nearbyMode && (
        <p className="text-gray-500 mb-8">
          Showing restaurants within 20km of your location
        </p>
      )}

      {/* Filters (only show in regular mode) */}
      {!nearbyMode && (
        <div className="bg-white border rounded-lg p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      updateFilters(search, undefined, undefined);
                    }
                  }}
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={() => updateFilters(search, undefined, undefined)}
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
                onChange={(e) => {
                  const newVal = e.target.value;
                  setWilayaId(newVal);
                  setPage(1);
                  updateFilters(undefined, newVal, undefined);
                }}
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
                value={categoryId}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setCategoryId(newVal);
                  setPage(1);
                  updateFilters(undefined, undefined, newVal);
                }}
                className="w-full px-3 py-2 border rounded-md"
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
          {/* Show active filters */}
          {(search || wilayaId || categoryId) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {search && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                  🔍 {search}
                  <button onClick={() => { setSearch(''); updateFilters('', undefined, undefined); }} className="ml-2 font-bold">×</button>
                </span>
              )}
              {wilayaId && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                  📍 {wilayas.find((w: any) => w.id === parseInt(wilayaId))?.name_en}
                  <button onClick={() => { setWilayaId(''); updateFilters(undefined, '', undefined); }} className="ml-2 font-bold">×</button>
                </span>
              )}
              {categoryId && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  🏷️ {categories.find((c: any) => c.id === categoryId)?.name_en}
                  <button onClick={() => { setCategoryId(''); updateFilters(undefined, undefined, ''); }} className="ml-2 font-bold">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setWilayaId('');
                  setCategoryId('');
                  navigate('/restaurants');
                }}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
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
                {restaurant.verified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
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

      {/* Pagination (regular mode only) */}
      {!nearbyMode && pagination && pagination.totalPages > 1 && (
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