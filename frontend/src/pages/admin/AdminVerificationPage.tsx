import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'reports'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  // Pending restaurants (PENDING + UNVERIFIED)
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin-pending-restaurants'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/restaurants/pending?limit=100');
      return response.data;
    },
    enabled: activeTab === 'pending',
  });

  // User-submitted restaurants
  const { data: submittedData, isLoading: submittedLoading } = useQuery({
    queryKey: ['admin-user-submitted'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/restaurants/user-submitted');
      return response.data;
    },
    enabled: activeTab === 'submitted',
  });

  // Reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-restaurant-reports'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/restaurant-reports');
      return response.data;
    },
    enabled: activeTab === 'reports',
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      setProcessing(id);
      const response = await apiClient.put(`/admin/restaurants/${id}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-submitted'] });
      setProcessing(null);
    },
    onError: () => setProcessing(null),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      setProcessing(id);
      const response = await apiClient.put(`/admin/restaurants/${id}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-submitted'] });
      setProcessing(null);
    },
    onError: () => setProcessing(null),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/restaurants/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-restaurants'] });
    },
  });

  const pending = pendingData?.data || [];
  const submitted = submittedData?.data || [];
  const reports = reportsData?.data || [];

  const renderRestaurantCard = (r: any, showSource = false) => (
    <div key={r.id} className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg">{r.name}</h3>
            {r.status === 'PENDING' && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                ⏳ PENDING
              </span>
            )}
            {r.status === 'ACTIVE' && r.verification_status === 'UNVERIFIED' && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                🟡 Non vérifié
              </span>
            )}
            {r.verification_status === 'VERIFIED' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                🟢 Vérifié
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            📍 {r.wilaya_name || 'Unknown'} {r.address ? `• ${r.address}` : ''}
          </p>
          {r.phone && <p className="text-sm text-gray-500">📞 {r.phone}</p>}
          {showSource && r.data_source && (
            <p className="text-xs text-gray-400 mt-1">Source: {r.data_source}</p>
          )}
          {showSource && r.submitted_by && (
            <p className="text-xs text-gray-400">Submitted by: {r.submitted_by}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={`/restaurants/${r.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 text-center"
          >
            View
          </a>
          <button
            onClick={() => verifyMutation.mutate(r.id)}
            disabled={processing === r.id}
            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
          >
            ✅ Verify
          </button>
          <button
            onClick={() => rejectMutation.mutate(r.id)}
            disabled={processing === r.id}
            className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 disabled:opacity-50"
          >
            ❌ Reject
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this restaurant?')) {
                deleteMutation.mutate(r.id);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🛡️ Verification & Moderation</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          🟡 Pending Verification ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'submitted' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          👤 User Submitted ({submitted.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-md text-sm ${activeTab === 'reports' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          ⚠️ Reports ({reports.length})
        </button>
      </div>

      {/* Pending */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingLoading && <div className="text-center py-8 text-gray-500">Loading...</div>}
          {!pendingLoading && pending.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white border rounded-lg">
              No pending restaurants
            </div>
          )}
          {pending.map((r: any) => renderRestaurantCard(r, false))}
        </div>
      )}

      {/* User Submitted */}
      {activeTab === 'submitted' && (
        <div className="space-y-3">
          {submittedLoading && <div className="text-center py-8 text-gray-500">Loading...</div>}
          {!submittedLoading && submitted.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white border rounded-lg">
              No user-submitted restaurants
            </div>
          )}
          {submitted.map((r: any) => renderRestaurantCard(r, true))}
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reportsLoading && <div className="text-center py-8 text-gray-500">Loading...</div>}
          {!reportsLoading && reports.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white border rounded-lg">
              No reports
            </div>
          )}
          {reports.map((report: any) => (
            <div key={report.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      {report.reason}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold mt-2">{report.restaurant_name || 'Unknown'}</h3>
                  {report.description && (
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  )}
                  {report.reporter_email && (
                    <p className="text-xs text-gray-400 mt-1">
                      Reported by: {report.reporter_email}
                    </p>
                  )}
                </div>
                {report.restaurant_id && (
                  <a
                    href={`/restaurants/${report.restaurant_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                  >
                    View Restaurant
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}