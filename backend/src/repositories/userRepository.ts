import { AppDataSource } from '../config/database';

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const users = await AppDataSource.query(
      `SELECT id, first_name, last_name, email, phone, password_hash, profile_photo, status, email_verified, phone_verified, created_at, last_login
       FROM users
       WHERE email = $1`,
      [email]
    );
    return users[0] || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const users = await AppDataSource.query(
      `SELECT id, first_name, last_name, email, phone, profile_photo, status, email_verified, phone_verified, created_at, last_login
       FROM users
       WHERE id = $1`,
      [id]
    );
    return users[0] || null;
  }

  /**
   * Create a new user
   */
  async create(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    passwordHash: string;
  }) {
    const result = await AppDataSource.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, phone, profile_photo, status, email_verified, phone_verified, created_at`,
      [userData.firstName, userData.lastName, userData.email, userData.phone, userData.passwordHash]
    );
    return result[0];
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string) {
    const roles = await AppDataSource.query(
      `SELECT r.name
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return roles.map((r: any) => r.name);
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleName: string) {
    await AppDataSource.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = $2
       ON CONFLICT DO NOTHING`,
      [userId, roleName]
    );
  }

  /**
   * Update last_login
   */
  async updateLastLogin(userId: string) {
    await AppDataSource.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
  }
}