import apiClient from './client';

export const notificationsApi = {
  async getNotifications(page: number = 1, limit: number = 20) {
    const response = await apiClient.get('/notifications', { params: { page, limit } });
    return response.data;
  },

  async markAsRead(notificationId: string) {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },
};