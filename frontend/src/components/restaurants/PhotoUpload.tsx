import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface PhotoUploadProps {
  restaurantId: string;
  onUploaded?: () => void;
}

export default function PhotoUpload({ restaurantId, onUploaded }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post(`/restaurants/${restaurantId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-photos', restaurantId] });
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setSuccess('Photo uploaded! It will be reviewed shortly.');
      setTimeout(() => setSuccess(''), 4000);
      onUploaded?.();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('photo', selectedFile);
    if (caption) formData.append('caption', caption);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-bold text-lg mb-2">📸 Add a Photo</h3>
      <p className="text-xs text-gray-500 mb-4">
        Help others discover this restaurant by sharing a photo.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">{success}</div>
      )}

      <div className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* File Input with Camera Support */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {preview ? 'Change Photo' : 'Choose Photo'}
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            onChange={handleFileChange}
            className="w-full text-sm border rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <p className="text-xs text-gray-400 mt-1">
            📱 On mobile, this opens your camera. Max size: 5MB.
          </p>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-2">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g., Grilled fish plate"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </div>
  );
}