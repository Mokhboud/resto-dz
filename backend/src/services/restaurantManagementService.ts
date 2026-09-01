import { RestaurantRepository } from '../repositories/restaurantRepository';
import { RestaurantClaimRepository } from '../repositories/restaurantClaimRepository';
import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../middleware/errorHandler';
import { AppDataSource } from '../config/database';

export class RestaurantManagementService {
  private restaurantRepository: RestaurantRepository;
  private claimRepository: RestaurantClaimRepository;
  private userRepository: UserRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
    this.claimRepository = new RestaurantClaimRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Generate slug from restaurant name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Create a new restaurant
   */
  async createRestaurant(userId: string, data: any) {
    const slug = this.generateSlug(data.name);

    // Use transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create restaurant
      const restaurant = await this.restaurantRepository.createRestaurant({
        name: data.name,
        slug,
        description: data.description,
        phone: data.phone,
        secondary_phone: data.secondary_phone,
        email: data.email,
        website: data.website,
        address: data.address,
        wilaya_id: data.wilaya_id,
        daira_id: data.daira_id,
        commune_id: data.commune_id,
        latitude: data.latitude,
        longitude: data.longitude,
        price_level: data.price_level,
        owner_id: userId,
      });

      // Assign RESTAURANT_OWNER role if not already assigned
      const userRoles = await this.userRepository.getUserRoles(userId);
      if (!userRoles.includes('RESTAURANT_OWNER')) {
        await this.userRepository.assignRole(userId, 'RESTAURANT_OWNER');
      }

      await queryRunner.commitTransaction();

      return restaurant;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update a restaurant
   */
  async updateRestaurant(restaurantId: string, userId: string, userRoles: string[], data: any) {
    // Check if restaurant exists
    const restaurant = await this.restaurantRepository.findByIdForManagement(restaurantId);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    // Authorization check
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');
    const isOwner = restaurant.owner_id === userId;

    if (!isAdmin && !isOwner) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    // Don't allow modifying ownership or verification through this endpoint
    const sanitizedData = { ...data };
    delete sanitizedData.owner_id;
    delete sanitizedData.verified;
    delete sanitizedData.verified_at;
    delete sanitizedData.deleted_at;

    const updated = await this.restaurantRepository.updateRestaurant(restaurantId, sanitizedData);

    if (!updated) {
      throw new AppError(400, 'No valid fields to update', 'NO_FIELDS_TO_UPDATE');
    }

    return updated;
  }

  /**
   * Soft delete a restaurant
   */
  async softDeleteRestaurant(restaurantId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');
    if (!isAdmin) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    const result = await this.restaurantRepository.softDeleteRestaurant(restaurantId);

    if (!result) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    return result;
  }

  /**
   * Submit a restaurant claim
   */
  async submitClaim(userId: string, restaurantId: string, data: any) {
    // Check if restaurant exists
    const restaurant = await this.restaurantRepository.findByIdForManagement(restaurantId);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    // Check if user already owns this restaurant
    if (restaurant.owner_id === userId) {
      throw new AppError(400, 'You already own this restaurant', 'ALREADY_OWNER');
    }

    // Check for duplicate active claim
    const hasActiveClaim = await this.claimRepository.hasActiveClaim(restaurantId, userId);
    if (hasActiveClaim) {
      throw new AppError(409, 'You already have a pending claim for this restaurant', 'DUPLICATE_CLAIM');
    }

    // Create claim
    const claim = await this.claimRepository.create({
      restaurantId,
      userId,
      phone: data.phone,
      notes: data.notes,
      proofDocument: data.proofDocument,
    });

    return claim;
  }

  /**
   * Get all claims (admin)
   */
  async getAllClaims(page: number, limit: number, status?: string) {
    return this.claimRepository.findAll(page, limit, status);
  }

  /**
   * Approve a claim (admin)
   */
  async approveClaim(claimId: string, adminUserId: string) {
    const claim = await this.claimRepository.findById(claimId);
    if (!claim) {
      throw new AppError(404, 'Claim not found', 'CLAIM_NOT_FOUND');
    }

    if (claim.status !== 'PENDING') {
      throw new AppError(400, 'Claim has already been processed', 'CLAIM_ALREADY_PROCESSED');
    }

    // Use transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update claim status
      await this.claimRepository.updateStatus(claimId, 'APPROVED', adminUserId);

      // Set restaurant owner
      await AppDataSource.query(
        `UPDATE restaurants SET owner_id = $1, verified = true, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [claim.user_id, claim.restaurant_id]
      );

      // Assign RESTAURANT_OWNER role
      await this.userRepository.assignRole(claim.user_id, 'RESTAURANT_OWNER');

      await queryRunner.commitTransaction();

      return { claimId, status: 'APPROVED' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Reject a claim (admin)
   */
  async rejectClaim(claimId: string, adminUserId: string) {
    const claim = await this.claimRepository.findById(claimId);
    if (!claim) {
      throw new AppError(404, 'Claim not found', 'CLAIM_NOT_FOUND');
    }

    if (claim.status !== 'PENDING') {
      throw new AppError(400, 'Claim has already been processed', 'CLAIM_ALREADY_PROCESSED');
    }

    const updated = await this.claimRepository.updateStatus(claimId, 'REJECTED', adminUserId);

    return updated;
  }
}