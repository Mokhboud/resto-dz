import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.me(),
  });

  const profile = data?.data || user;

  if (isLoading && !profile) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Please login to view your profile</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">👤 My Profile</h1>
      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">First Name</label>
            <p className="font-semibold">{profile.first_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Last Name</label>
            <p className="font-semibold">{profile.last_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p className="font-semibold">{profile.phone || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <p className="font-semibold">{profile.status}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Roles</label>
            <div className="flex flex-wrap gap-2">
              {profile.roles?.map((role: string) => (
                <span key={role} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}