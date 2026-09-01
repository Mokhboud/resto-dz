import { AppDataSource } from '../src/config/database';

let isDbInitialized = false;

export const setupTestDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    isDbInitialized = true;
  }
};

export const teardownTestDatabase = async () => {
  // Only destroy if we initialized it in this test suite
  if (AppDataSource.isInitialized && isDbInitialized) {
    await AppDataSource.destroy();
    isDbInitialized = false;
  }
};

export const cleanupTestData = async () => {
  if (AppDataSource.isInitialized) {
    // Clean up test user created by previous runs
    await AppDataSource.query(
      `DELETE FROM users WHERE email = 'test_user@test.com'`
    );
  }
};