import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { t } = useTranslation();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: restaurantsApi.getCategories,
  });

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const { data: rankingData } = useQuery({
    queryKey: ['ranking-top'],
    queryFn: () => restaurantsApi.getRankedRestaurants({ limit: 6 }),
  });

  const { data: nearbyData } = useQuery({
    queryKey: ['nearby-home'],
    queryFn: () =>
      restaurantsApi.getNearbyRestaurants(userLocation!.lat, userLocation!.lng, 10),
    enabled: !!userLocation,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        navigate(`/restaurants?nearby=true&lat=${lat}&lng=${lng}`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Alger on any error
        alert('Using Alger as default location. You can search by wilaya instead.');
        setUserLocation({ lat: 36.7538, lng: 3.0588 });
        navigate(`/restaurants?nearby=true&lat=36.7538&lng=3.0588`);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const categories = categoriesData?.data || [];
  const wilayas = wilayasData?.data || [];
  const topRanked = rankingData?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🇩🇿 {t('home.heroTitle')}
          </h1>
          <p className="text-lg mb-8 text-orange-100">
            {t('app.tagline')}
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50"
              >
                {t('home.searchButton')}
              </button>
            </div>
          </form>

          <button
            onClick={handleLocationSearch}
            className="mt-4 px-6 py-2 bg-white/20 border border-white/40 rounded-lg hover:bg-white/30"
          >
            {t('home.nearby')}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.categories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((cat: any) => (
            <Link
              key={cat.id}
              to={`/restaurants?category_id=${cat.id}`}
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm">
                {localStorage.getItem('language') === 'ar' ? cat.name_ar : localStorage.getItem('language') === 'fr' ? cat.name_fr : cat.name_en}
              </div>
              <div className="text-xs text-gray-500">{cat.name_fr}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Ranked */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('home.topRanked')}</h2>
            <Link to="/ranking" className="text-orange-600 hover:underline">
              {t('home.viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRanked.map((restaurant: any) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                    {restaurant.verified && (
                      <span className="text-blue-500 text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.wilaya_name}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-yellow-500 font-bold">
                      ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({restaurant.review_count})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Restaurants */}
      {userLocation && nearbyData && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">📍 Near You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyData.data?.map((restaurant: any) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h3 className="font-bold">{restaurant.name}</h3>
                <p className="text-sm text-gray-500">{restaurant.wilaya_name}</p>
                <p className="text-sm text-gray-600 mt-2">
                  📏 {parseFloat(restaurant.distance_km || '0').toFixed(1)} km
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({restaurant.review_count})</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Wilayas */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t('home.byWilaya')}</h2>
          <div className="flex flex-wrap gap-2">
            {wilayas.slice(0, 20).map((wilaya: any) => (
              <Link
                key={wilaya.id}
                to={`/restaurants?wilaya_id=${wilaya.id}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition"
              >
                {localStorage.getItem('language') === 'ar' ? wilaya.name_ar : localStorage.getItem('language') === 'fr' ? wilaya.name_fr : wilaya.name_en}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}