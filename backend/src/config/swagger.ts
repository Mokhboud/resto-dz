import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Resto DZ API',
    version: '1.0.0',
    description: 'Algerian Restaurant Discovery Platform API',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development Server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Restaurants', description: 'Restaurant management and discovery' },
    { name: 'Categories', description: 'Restaurant categories' },
    { name: 'Cuisines', description: 'Cuisine types' },
    { name: 'Wilayas', description: 'Algerian administrative divisions' },
    { name: 'Reviews', description: 'Restaurant reviews and ratings' },
    { name: 'Favorites', description: 'User favorites' },
    { name: 'Users', description: 'User profile management' },
    { name: 'Owner', description: 'Restaurant owner dashboard' },
    { name: 'Admin', description: 'Admin dashboard and moderation' },
    { name: 'Reports', description: 'Content reporting system' },
    { name: 'Photos', description: 'Restaurant photo management' },
  ],
  paths: {
    // Auth
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                  firstName: { type: 'string', example: 'Ahmed' },
                  lastName: { type: 'string', example: 'Benali' },
                  email: { type: 'string', example: 'ahmed@example.com' },
                  phone: { type: 'string', example: '0550123456' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '409': { description: 'Email already exists' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'ahmed@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile retrieved' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logged out successfully' },
        },
      },
    },

    // Restaurants
    '/restaurants': {
      get: {
        tags: ['Restaurants'],
        summary: 'List restaurants with filters',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term' },
          { name: 'wilaya_id', in: 'query', schema: { type: 'integer' }, description: 'Filter by wilaya' },
          { name: 'category_id', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'cuisine_id', in: 'query', schema: { type: 'string' }, description: 'Filter by cuisine' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'List of restaurants' },
        },
      },
      post: {
        tags: ['Restaurants'],
        summary: 'Create a restaurant (authenticated)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                  wilaya_id: { type: 'integer' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  price_level: { type: 'integer', minimum: 1, maximum: 5 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Restaurant created' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/restaurants/nearby': {
      get: {
        tags: ['Restaurants'],
        summary: 'Find nearby restaurants',
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'radius', in: 'query', schema: { type: 'number', default: 5 }, description: 'Radius in km' },
        ],
        responses: {
          '200': { description: 'Nearby restaurants' },
        },
      },
    },
    '/restaurants/ranking': {
      get: {
        tags: ['Restaurants'],
        summary: 'Get ranked restaurants (Bayesian)',
        parameters: [
          { name: 'wilaya_id', in: 'query', schema: { type: 'integer' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'Ranked restaurants' },
        },
      },
    },
    '/restaurants/{id}': {
      get: {
        tags: ['Restaurants'],
        summary: 'Get restaurant details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Restaurant details' },
          '404': { description: 'Restaurant not found' },
        },
      },
      put: {
        tags: ['Restaurants'],
        summary: 'Update restaurant (owner/admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Restaurant updated' },
          '403': { description: 'Insufficient permissions' },
        },
      },
      delete: {
        tags: ['Restaurants'],
        summary: 'Delete restaurant (admin only - soft delete)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Restaurant deleted' },
          '403': { description: 'Insufficient permissions' },
        },
      },
    },
    '/restaurants/{id}/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'List restaurant reviews',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: {
          '200': { description: 'Reviews list' },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create review (authenticated)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Review created' },
          '409': { description: 'Review already exists' },
        },
      },
    },
    '/restaurants/{id}/photos': {
      get: {
        tags: ['Photos'],
        summary: 'List restaurant photos',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Photos list' },
        },
      },
      post: {
        tags: ['Photos'],
        summary: 'Upload restaurant photo',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  photo: { type: 'string', format: 'binary' },
                  caption: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Photo uploaded' },
        },
      },
    },

    // Categories
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List categories',
        responses: {
          '200': { description: 'Categories list' },
        },
      },
    },
    '/cuisines': {
      get: {
        tags: ['Cuisines'],
        summary: 'List cuisines',
        responses: {
          '200': { description: 'Cuisines list' },
        },
      },
    },

    // Wilayas
    '/wilayas': {
      get: {
        tags: ['Wilayas'],
        summary: 'List all 58 wilayas',
        responses: {
          '200': { description: 'Wilayas list' },
        },
      },
    },
    '/wilayas/{id}/communes': {
      get: {
        tags: ['Wilayas'],
        summary: 'List communes by wilaya',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Communes list' },
        },
      },
    },
    '/wilayas/{id}/dairas': {
      get: {
        tags: ['Wilayas'],
        summary: 'List dairas by wilaya',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Dairas list' },
        },
      },
    },

    // Favorites
    '/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'List user favorites',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Favorites list' },
        },
      },
    },
    '/restaurants/{id}/favorite': {
      post: {
        tags: ['Favorites'],
        summary: 'Add to favorites',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Added to favorites' },
        },
      },
      delete: {
        tags: ['Favorites'],
        summary: 'Remove from favorites',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Removed from favorites' },
        },
      },
    },

    // Users
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  phone: { type: 'string' },
                  profilePhoto: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profile updated' },
        },
      },
    },

    // Owner
    '/owner/dashboard': {
      get: {
        tags: ['Owner'],
        summary: 'Owner dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Dashboard stats' },
        },
      },
    },
    '/owner/restaurants': {
      get: {
        tags: ['Owner'],
        summary: 'List own restaurants',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Restaurants list' },
        },
      },
    },

    // Admin
    '/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Admin dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Admin stats' },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List users',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Users list' },
        },
      },
    },
    '/admin/restaurants': {
      get: {
        tags: ['Admin'],
        summary: 'List restaurants (admin view)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Restaurants list' },
        },
      },
    },
    '/admin/reviews': {
      get: {
        tags: ['Admin'],
        summary: 'List reviews (admin view)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Reviews list' },
        },
      },
    },

    // Reports
    '/reports': {
      post: {
        tags: ['Reports'],
        summary: 'Submit a report',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['targetType', 'targetId', 'reason'],
                properties: {
                  targetType: { type: 'string', enum: ['RESTAURANT', 'REVIEW', 'USER', 'RESPONSE'] },
                  targetId: { type: 'string', format: 'uuid' },
                  reason: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Report submitted' },
        },
      },
    },
    '/admin/reports': {
      get: {
        tags: ['Reports'],
        summary: 'List reports (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Reports list' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default swaggerDocument;