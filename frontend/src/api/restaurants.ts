import apiClient from './client';

export const restaurantsApi = {
  async getRestaurants(params?: {
    search?: string;
    wilaya_id?: number;
    category_id?: string;
    cuisine_id?: string;
    page?: number;
    limit?: number;
    verified?: boolean;
  }) {
    const response = await apiClient.get('/restaurants', { params });
    return response.data;
  },

  async getRestaurantById(id: string) {
    const response = await apiClient.get(`/restaurants/${id}`);
    return response.data;
  },

  async getNearbyRestaurants(lat: number, lng: number, radius: number = 5) {
    const response = await apiClient.get('/restaurants/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  async getRankedRestaurants(params?: {
    wilaya_id?: number;
    category_id?: string;
    cuisine_id?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/restaurants/ranking', { params });
    return response.data;
  },

  async getCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  async getCuisines() {
    const response = await apiClient.get('/cuisines');
    return response.data;
  },

  async getWilayas() {
    const response = await apiClient.get('/wilayas');
    return response.data;
  },

  async getRestaurantReviews(restaurantId: string, page: number = 1) {
    const response = await apiClient.get(`/restaurants/${restaurantId}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  async addFavorite(restaurantId: string) {
    const response = await apiClient.post(`/restaurants/${restaurantId}/favorite`);
    return response.data;
  },

  async removeFavorite(restaurantId: string) {
    const response = await apiClient.delete(`/restaurants/${restaurantId}/favorite`);
    return response.data;
  },

  async getFavorites(page: number = 1) {
    const response = await apiClient.get('/favorites', { params: { page } });
    return response.data;
  },

  async createReview(restaurantId: string, data: { rating: number; comment?: string }) {
    const response = await apiClient.post(`/restaurants/${restaurantId}/reviews`, data);
    return response.data;
  },
};