import request from 'supertest';
import { createApp } from '../src/app';
import { setupTestDatabase, teardownTestDatabase } from './setup';

describe('Restaurants API', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/restaurants', () => {
    it('should return restaurant list with pagination', async () => {
      const response = await request(app)
        .get('/api/restaurants')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/restaurants?search=pizza')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support wilaya filter', async () => {
      const response = await request(app)
        .get('/api/restaurants?wilaya_id=16')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/restaurants/nearby', () => {
    it('should return nearby restaurants', async () => {
      const response = await request(app)
        .get('/api/restaurants/nearby?lat=36.7538&lng=3.0588&radius=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should validate coordinates', async () => {
      await request(app)
        .get('/api/restaurants/nearby')
        .expect(400);
    });
  });

  describe('GET /api/restaurants/ranking', () => {
    it('should return ranked restaurants', async () => {
      const response = await request(app)
        .get('/api/restaurants/ranking')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.meta).toBeDefined();
    });
  });
});