import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface MenuDisplayProps {
  restaurantId: string;
}

export default function MenuDisplay({ restaurantId }: MenuDisplayProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: async () => {
      const response = await apiClient.get(`/restaurants/${restaurantId}/menu`);
      return response.data;
    },
  });

  const menu = data?.data || [];

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">🍽️ Menu</h2>
        <div className="text-gray-500 text-center py-4">Loading menu...</div>
      </div>
    );
  }

  if (menu.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">🍽️ Menu</h2>
        <div className="text-gray-400 text-center py-4">
          No menu available yet. The owner can add one after claiming this restaurant.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">🍽️ Menu</h2>
      <div className="space-y-6">
        {menu.map((category: any) => (
          <div key={category.id}>
            <h3 className="font-bold text-lg text-orange-700 mb-3 border-b pb-2">
              {category.name}
              {category.name_ar && <span className="text-gray-500 text-sm ml-2">{category.name_ar}</span>}
            </h3>
            <div className="space-y-3">
              {category.items?.map((item: any) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.is_popular && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">⭐ Popular</span>}
                      {item.is_spicy && <span className="text-xs">🌶️</span>}
                      {item.is_vegetarian && <span className="text-xs">🌱</span>}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                  {item.price && (
                    <span className="font-bold text-green-700 whitespace-nowrap">
                      {parseFloat(item.price).toFixed(0)} DA
                    </span>
                  )}
                </div>
              ))}
              {category.items?.length === 0 && (
                <p className="text-gray-400 text-sm italic">No items in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}