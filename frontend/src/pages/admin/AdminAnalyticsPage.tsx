import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'visits' | 'logins' | 'users'>('stats');

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
  });

  const { data: visitsData, isLoading: visitsLoading } = useQuery({
    queryKey: ['admin-visits'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/visits?limit=50');
      return response.data;
    },
    enabled: activeTab === 'visits',
  });

  const { data: loginsData, isLoading: loginsLoading } = useQuery({
    queryKey: ['admin-login-history'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/login-history?limit=50');
      return response.data;
    },
    enabled: activeTab === 'logins',
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users?limit=50');
      return response.data;
    },
    enabled: activeTab === 'users',
  });

  const stats = statsData?.data;
  const visits = visitsData?.data || [];
  const logins = loginsData?.data || [];
  const users = usersData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📊 Admin Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'stats' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          📈 Overview
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'visits' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          👁️ Visits
        </button>
        <button
          onClick={() => setActiveTab('logins')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'logins' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          🔐 Logins
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'users' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          👥 Users
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats?.total_visits || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Visits</div>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats?.today_visits || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Today's Visits</div>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Registered Users</div>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats?.total_logins || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Logins</div>
          </div>
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold">Recent Visits</h2>
          </div>
          {visitsLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : visits.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No visits recorded yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">IP Address</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Path</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit: any) => (
                    <tr key={visit.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-xs">{visit.ip_address}</td>
                      <td className="px-4 py-2">
                        {visit.email ? (
                          <span className="text-blue-600">{visit.email}</span>
                        ) : (
                          <span className="text-gray-400">Anonymous</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">{visit.path}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${visit.method === 'GET' ? 'bg-green-100 text-green-700' : visit.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                          {visit.method}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {new Date(visit.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Logins Tab */}
      {activeTab === 'logins' && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold">Login History</h2>
          </div>
          {loginsLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : logins.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No logins recorded yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logins.map((login: any) => (
                    <tr key={login.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-blue-600">{login.email}</td>
                      <td className="px-4 py-2">{login.first_name} {login.last_name}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {new Date(login.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold">Registered Users</h2>
          </div>
          {usersLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No users registered yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Roles</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{user.first_name} {user.last_name}</td>
                      <td className="px-4 py-2 text-blue-600">{user.email}</td>
                      <td className="px-4 py-2 text-xs">{user.phone || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role: string) => (
                            <span key={role} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}