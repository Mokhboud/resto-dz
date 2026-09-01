import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../middleware/errorHandler';
import { AppDataSource } from '../config/database';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const roles = await this.userRepository.getUserRoles(userId);

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      profile_photo: user.profile_photo,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      created_at: user.created_at,
      last_login: user.last_login,
      roles,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profilePhoto?: string;
  }) {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.firstName !== undefined) {
      updates.push(`first_name = $${paramIndex}`);
      params.push(data.firstName);
      paramIndex++;
    }

    if (data.lastName !== undefined) {
      updates.push(`last_name = $${paramIndex}`);
      params.push(data.lastName);
      paramIndex++;
    }

    if (data.phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      params.push(data.phone);
      paramIndex++;
    }

    if (data.profilePhoto !== undefined) {
      updates.push(`profile_photo = $${paramIndex}`);
      params.push(data.profilePhoto);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new AppError(400, 'No valid fields to update', 'NO_FIELDS_TO_UPDATE');
    }

    params.push(userId);
    const result = await AppDataSource.query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING id, first_name, last_name, email, phone, profile_photo, status, email_verified, phone_verified, created_at, last_login`,
      params
    );

    const updatedUser = result[0];
    const roles = await this.userRepository.getUserRoles(userId);

    return {
      ...updatedUser,
      roles,
    };
  }
}