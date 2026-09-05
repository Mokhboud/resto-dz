import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';
import crypto from 'crypto';
import { emailService } from './emailService';
import { AppDataSource } from '../config/database';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
    const expiresIn = process.env.JWT_EXPIRATION || '15m';
    
    return jwt.sign(
      { userId, email },
      secret,
      { expiresIn } as jwt.SignOptions
    );
  }

  /**
   * Generate JWT refresh token
   */
  private generateRefreshToken(userId: string, email: string): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION || '7d';
    
    return jwt.sign(
      { userId, email },
      secret,
      { expiresIn } as jwt.SignOptions
    );
  }

  /**
   * Register a new user
   */
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    const { firstName, lastName, email, phone, password } = userData;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError(409, 'Email already registered', 'EMAIL_ALREADY_EXISTS');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone || null,
      passwordHash,
    });

    // Assign USER role
    await this.userRepository.assignRole(user.id, 'USER');

    // Get user roles
    const roles = await this.userRepository.getUserRoles(user.id);

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    // Send verification email (non-blocking)
    this.sendVerificationEmail(user.id).catch(err => 
      logger.error(`Failed to send verification email: ${err}`)
    );

    logger.info(`New user registered: ${user.email}`);

    return {
      user: {
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
        roles,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

    /**
   * Login user
   */
  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AppError(403, 'Account is not active', 'ACCOUNT_INACTIVE');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${normalizedEmail}`);
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Update last_login
    await this.userRepository.updateLastLogin(user.id);

    // Log login history
    await AppDataSource.query(
      `INSERT INTO login_history (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [user.id, 'tracked', 'login']
    ).catch(() => {
      // Silent fail — tracking should never break login
    });

    // Get user roles
    const roles = await this.userRepository.getUserRoles(user.id);

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        profile_photo: user.profile_photo,
        status: user.status,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        last_login: user.last_login,
        roles,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }


  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string) {
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
   * Verify JWT token
   */
  verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
      return decoded as { userId: string; email: string };
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
    }
  }

  /**
   * Generate email verification token and send email
   */
  async sendVerificationEmail(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await AppDataSource.query(
      `UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3`,
      [token, expires, userId]
    );

    const user = await this.userRepository.findById(userId);
    if (user) {
      await emailService.sendVerificationEmail(user.email, user.first_name, token);
    }

    return { message: 'Verification email sent' };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    const result = await AppDataSource.query(
      `SELECT id, email FROM users 
       WHERE email_verification_token = $1 
         AND email_verification_expires > CURRENT_TIMESTAMP 
         AND email_verified = false`,
      [token]
    );

    const user = result[0];
    if (!user) {
      throw new AppError(400, 'Invalid or expired verification token', 'INVALID_TOKEN');
    }

    await AppDataSource.query(
      `UPDATE users SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL WHERE id = $1`,
      [user.id]
    );

    return { message: 'Email verified successfully' };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await AppDataSource.query(
      `UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3`,
      [token, expires, user.id]
    );

    await emailService.sendPasswordResetEmail(user.email, user.first_name, token);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    const result = await AppDataSource.query(
      `SELECT id FROM users 
       WHERE reset_password_token = $1 
         AND reset_password_expires > CURRENT_TIMESTAMP`,
      [token]
    );

    const user = result[0];
    if (!user) {
      throw new AppError(400, 'Invalid or expired reset token', 'INVALID_TOKEN');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await AppDataSource.query(
      `UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2`,
      [passwordHash, user.id]
    );

    return { message: 'Password reset successfully' };
  }
}