import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'resto_dz_test',
  synchronize: true,
  logging: false,
  entities: ['src/models/**/*.ts'],
});