import request from 'supertest';
import { createApp } from '../src/app';
import { setupTestDatabase, teardownTestDatabase, cleanupTestData } from './setup';

describe('Auth API', () => {
  let app: ReturnType<typeof createApp>;

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_${Date.now()}@example.com`, // Always unique
    password: 'StrongPass123!',
  };

  let accessToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    await cleanupTestData(); // Remove old test users
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      accessToken = response.body.data.tokens.accessToken;
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.errorCode).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });

    it('should return user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.email).toBe(testUser.email);
    });
  });
});