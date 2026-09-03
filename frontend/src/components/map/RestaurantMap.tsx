import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RestaurantMapProps {
  restaurants: any[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
}

export default function RestaurantMap({
  restaurants,
  centerLat = 36.7538,
  centerLng = 3.0588,
  zoom = 12,
  height = '400px',
}: RestaurantMapProps) {
  const validRestaurants = restaurants.filter((r) => r.latitude && r.longitude);

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
          >
            <Popup>
              <div className="p-1">
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="font-bold text-sm hover:text-orange-600"
                >
                  {restaurant.name}
                </Link>
                <p className="text-xs text-gray-600 mt-1">{restaurant.address}</p>
                <p className="text-xs mt-1">
                  ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)} ({restaurant.review_count} reviews)
                </p>
                <a
                  href={`https://www.openstreetmap.org/directions?from=&to=${restaurant.latitude},${restaurant.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  🚗 Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}