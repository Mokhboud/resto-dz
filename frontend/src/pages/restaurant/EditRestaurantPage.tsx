import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { restaurantsApi } from '../../api/restaurants';
import { useAuthStore } from '../../stores/authStore';

export default function EditRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: restaurantData, isLoading } = useQuery({
    queryKey: ['restaurant-edit', id],
    queryFn: async () => {
      const response = await apiClient.get(`/restaurants/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: wilayasData } = useQuery({
    queryKey: ['wilayas'],
    queryFn: restaurantsApi.getWilayas,
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    secondary_phone: '',
    email: '',
    website: '',
    address: '',
    wilaya_id: '',
    latitude: '',
    longitude: '',
    price_level: '2',
  });

  useEffect(() => {
    if (restaurantData?.data) {
      const r = restaurantData.data;
      setForm({
        name: r.name || '',
        description: r.description || '',
        phone: r.phone || '',
        secondary_phone: r.secondary_phone || '',
        email: r.email || '',
        website: r.website || '',
        address: r.address || '',
        wilaya_id: r.wilaya_id ? String(r.wilaya_id) : '',
        latitude: r.latitude ? String(r.latitude) : '',
        longitude: r.longitude ? String(r.longitude) : '',
        price_level: String(r.price_level || 2),
      });
    }
  }, [restaurantData]);

  const wilayas = wilayasData?.data || [];
  const restaurant = restaurantData?.data;

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put(`/restaurants/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Restaurant updated successfully!');
      setError('');
      setTimeout(() => navigate(`/restaurants/${id}`), 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update restaurant');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
      },
      () => alert('Unable to get your location')
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      setError('You must be logged in');
      return;
    }

    const data: any = {
      name: form.name,
      description: form.description || undefined,
      phone: form.phone || undefined,
      secondary_phone: form.secondary_phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      address: form.address || undefined,
      wilaya_id: form.wilaya_id ? parseInt(form.wilaya_id) : undefined,
      price_level: form.price_level ? parseInt(form.price_level) : undefined,
    };

    if (form.latitude && form.longitude) {
      data.latitude = parseFloat(form.latitude);
      data.longitude = parseFloat(form.longitude);
    }

    updateMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">🔒 Login Required</h1>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-12">Restaurant not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">✏️ Edit Restaurant</h1>
      <p className="text-gray-500 mb-8">Update the information for {restaurant.name}</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Restaurant Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secondary Phone</label>
            <input
              type="text"
              name="secondary_phone"
              value={form.secondary_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <h2 className="text-lg font-bold border-b pb-2 pt-4">Location</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wilaya</label>
          <select
            name="wilaya_id"
            value={form.wilaya_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Select a Wilaya</option>
            {wilayas.map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.code} - {w.name_en} ({w.name_ar})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseLocation}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
        >
          📍 Use My Current Location
        </button>

        <h2 className="text-lg font-bold border-b pb-2 pt-4">Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Price Level</label>
          <select
            name="price_level"
            value={form.price_level}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="1">$ — Budget friendly</option>
            <option value="2">$$ — Moderate</option>
            <option value="3">$$$ — Upscale</option>
            <option value="4">$$$$ — Fine dining</option>
          </select>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 font-semibold"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/restaurants/${id}`)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}