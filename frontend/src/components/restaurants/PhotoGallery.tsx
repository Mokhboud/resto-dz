import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface PhotoGalleryProps {
  restaurantId: string;
  isOwner?: boolean;
}

export default function PhotoGallery({ restaurantId, isOwner = false }: PhotoGalleryProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['restaurant-photos', restaurantId],
    queryFn: async () => {
      const response = await apiClient.get(`/restaurants/${restaurantId}/photos`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await apiClient.delete(`/restaurant-photos/${photoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-photos', restaurantId] });
    },
  });

  const setCoverMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await apiClient.put(`/restaurants/${restaurantId}/photos/${photoId}/cover`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-photos', restaurantId] });
    },
  });

  const photos = data?.data || [];

  if (isLoading) {
    return <div className="text-center py-6 text-gray-500">Loading photos...</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        📷 No photos yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo: any) => (
        <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <img
            src={photo.url}
            alt={photo.caption || 'Restaurant photo'}
            className="w-full h-full object-cover"
          />
          
          {photo.is_cover && (
            <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              ★ Cover
            </div>
          )}

          {photo.caption && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {photo.caption}
            </div>
          )}

          {isOwner && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              {!photo.is_cover && (
                <button
                  onClick={() => setCoverMutation.mutate(photo.id)}
                  className="bg-white text-orange-600 text-xs px-2 py-1 rounded-full hover:bg-orange-50"
                  title="Set as cover"
                >
                  ⭐
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Delete this photo?')) {
                    deleteMutation.mutate(photo.id);
                  }
                }}
                className="bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                title="Delete photo"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}