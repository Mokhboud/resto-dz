import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';

export class MenuService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Get full menu for a restaurant
   */
  async getRestaurantMenu(restaurantId: string) {
    const categories = await AppDataSource.query(
      `SELECT id, name, name_ar, display_order, is_active
       FROM menu_categories
       WHERE restaurant_id = $1 AND is_active = true
       ORDER BY display_order ASC`,
      [restaurantId]
    );

    const items = await AppDataSource.query(
      `SELECT id, category_id, name, name_ar, description, price, 
              is_available, is_popular, is_spicy, is_vegetarian, display_order
       FROM menu_items
       WHERE restaurant_id = $1 AND is_available = true
       ORDER BY display_order ASC`,
      [restaurantId]
    );

    // Group items by category
    const menu = categories.map((cat: any) => ({
      ...cat,
      items: items.filter((item: any) => item.category_id === cat.id),
    }));

    return menu;
  }

  /**
   * Create menu category
   */
  async createCategory(restaurantId: string, userId: string, userRoles: string[], data: { name: string; name_ar?: string; display_order?: number }) {
    await this.checkOwnership(restaurantId, userId, userRoles);

    const result = await AppDataSource.query(
      `INSERT INTO menu_categories (restaurant_id, name, name_ar, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, name_ar, display_order`,
      [restaurantId, data.name, data.name_ar || null, data.display_order || 0]
    );
    return result[0];
  }

  /**
   * Create menu item
   */
  async createItem(restaurantId: string, userId: string, userRoles: string[], data: any) {
    await this.checkOwnership(restaurantId, userId, userRoles);

    const result = await AppDataSource.query(
      `INSERT INTO menu_items (restaurant_id, category_id, name, name_ar, description, price, is_available, is_popular, is_spicy, is_vegetarian, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, price, is_available`,
      [
        restaurantId,
        data.category_id,
        data.name,
        data.name_ar || null,
        data.description || null,
        data.price || null,
        data.is_available !== false,
        data.is_popular || false,
        data.is_spicy || false,
        data.is_vegetarian || false,
        data.display_order || 0,
      ]
    );
    return result[0];
  }

  /**
   * Delete menu category
   */
  async deleteCategory(categoryId: string, userId: string, userRoles: string[]) {
    // Get restaurant_id from category
    const catResult = await AppDataSource.query(
      `SELECT restaurant_id FROM menu_categories WHERE id = $1`,
      [categoryId]
    );
    if (!catResult[0]) {
      throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
    }

    await this.checkOwnership(catResult[0].restaurant_id, userId, userRoles);

    await AppDataSource.query(
      `DELETE FROM menu_categories WHERE id = $1`,
      [categoryId]
    );
    return { id: categoryId, deleted: true };
  }

  /**
   * Delete menu item
   */
  async deleteItem(itemId: string, userId: string, userRoles: string[]) {
    const itemResult = await AppDataSource.query(
      `SELECT restaurant_id FROM menu_items WHERE id = $1`,
      [itemId]
    );
    if (!itemResult[0]) {
      throw new AppError(404, 'Item not found', 'ITEM_NOT_FOUND');
    }

    await this.checkOwnership(itemResult[0].restaurant_id, userId, userRoles);

    await AppDataSource.query(
      `DELETE FROM menu_items WHERE id = $1`,
      [itemId]
    );
    return { id: itemId, deleted: true };
  }

  /**
   * Check ownership or admin
   */
  private async checkOwnership(restaurantId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');
    if (isAdmin) return;

    const isOwner = await this.restaurantRepository.isOwner(restaurantId, userId);
    if (!isOwner) {
      throw new AppError(403, 'You can only manage your own restaurant', 'INSUFFICIENT_PERMISSIONS');
    }
  }
}