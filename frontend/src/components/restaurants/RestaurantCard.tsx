import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: any;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const getVerificationBadge = () => {
    const status = restaurant.verification_status || 'UNVERIFIED';
    if (status === 'VERIFIED') {
      return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🟢 Vérifié</span>;
    }
    if (status === 'CLAIMED') {
      return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🔵 Revendiqué</span>;
    }
    return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">🟡 Non vérifié</span>;
  };

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold text-lg">{restaurant.name}</h2>
          <div className="flex flex-col items-end gap-1">
            {restaurant.verified && <span className="text-blue-500 text-sm">✓</span>}
            {getVerificationBadge()}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {restaurant.wilaya_name} • {restaurant.address || 'Adresse à confirmer'}
        </p>
        {restaurant.distance_km && (
          <p className="text-sm text-green-600 mt-1">
            📏 {parseFloat(restaurant.distance_km).toFixed(1)} km
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
  );
}