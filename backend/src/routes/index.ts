import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurantController';
import { CategoryController } from '../controllers/categoryController';
import { CuisineController } from '../controllers/cuisineController';
import { WilayaController } from '../controllers/wilayaController';
import { AuthController } from '../controllers/authController';
import { RestaurantManagementController } from '../controllers/restaurantManagementController';
import { AdminController } from '../controllers/adminController';
import { UserController } from '../controllers/userController';
import { FavoriteController } from '../controllers/favoriteController';
import { ReviewController } from '../controllers/reviewController';
import { RankingController } from '../controllers/rankingController';
import { authenticate, authorize } from '../middleware/auth';
import { OwnerDashboardController } from '../controllers/ownerDashboardController';
import { ReviewResponseController } from '../controllers/reviewResponseController';
import { ReportController } from '../controllers/reportController';
import { ImportController } from '../controllers/importController';
import { PhotoController } from '../controllers/photoController';
import { uploadImage } from '../middleware/upload';
import { NotificationController } from '../controllers/notificationController';
import { EnhancedImportController } from '../controllers/enhancedImportController';

const router = Router();

// Controllers
const restaurantController = new RestaurantController();
const categoryController = new CategoryController();
const cuisineController = new CuisineController();
const wilayaController = new WilayaController();
const authController = new AuthController();
const restaurantManagementController = new RestaurantManagementController();
const adminController = new AdminController();
const userController = new UserController();
const favoriteController = new FavoriteController();
const reviewController = new ReviewController();
const rankingController = new RankingController();
const ownerDashboardController = new OwnerDashboardController();
const reviewResponseController = new ReviewResponseController();
const reportController = new ReportController();
const importController = new ImportController();
const photoController = new PhotoController();
const notificationController = new NotificationController();
const enhancedImportController = new EnhancedImportController();


// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Resto DZ API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Auth routes
router.post('/auth/register', authController.register.bind(authController));
router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/logout', authController.logout.bind(authController));
router.get('/auth/me', authenticate, authController.me.bind(authController));

// User profile routes
router.get('/users/profile', authenticate, userController.getProfile.bind(userController));
router.put('/users/profile', authenticate, userController.updateProfile.bind(userController));

// Favorites routes
router.get('/favorites', authenticate, favoriteController.getFavorites.bind(favoriteController));
router.post('/restaurants/:id/favorite', authenticate, favoriteController.addFavorite.bind(favoriteController));
router.delete('/restaurants/:id/favorite', authenticate, favoriteController.removeFavorite.bind(favoriteController));

// Review routes
router.post('/restaurants/:id/reviews', authenticate, reviewController.createReview.bind(reviewController));
router.get('/restaurants/:id/reviews', reviewController.getRestaurantReviews.bind(reviewController));
router.put('/reviews/:id', authenticate, reviewController.updateReview.bind(reviewController));
router.delete('/reviews/:id', authenticate, reviewController.deleteReview.bind(reviewController));

// Photo routes
router.get('/restaurants/:id/photos', photoController.getRestaurantPhotos.bind(photoController));
router.post('/restaurants/:id/photos', authenticate, uploadImage.single('photo'), photoController.uploadRestaurantPhoto.bind(photoController));
router.delete('/restaurant-photos/:photoId', authenticate, photoController.deletePhoto.bind(photoController));
router.put('/restaurants/:id/photos/:photoId/cover', authenticate, photoController.setCoverPhoto.bind(photoController));

// Restaurant public routes
// NOTE: /nearby and /ranking must be BEFORE /:id
router.get('/restaurants/nearby', restaurantController.getNearbyRestaurants.bind(restaurantController));
router.get('/restaurants/ranking', rankingController.getRankedRestaurants.bind(rankingController));
router.get('/restaurants', restaurantController.getRestaurants.bind(restaurantController));
router.get('/restaurants/:id', restaurantController.getRestaurantById.bind(restaurantController));

// Restaurant management routes
router.post('/restaurants', authenticate, restaurantManagementController.createRestaurant.bind(restaurantManagementController));
router.put('/restaurants/:id', authenticate, restaurantManagementController.updateRestaurant.bind(restaurantManagementController));
router.delete('/restaurants/:id', authenticate, restaurantManagementController.deleteRestaurant.bind(restaurantManagementController));
router.post('/restaurants/:id/claim', authenticate, restaurantManagementController.submitClaim.bind(restaurantManagementController));

// Owner dashboard routes
router.get('/owner/dashboard', authenticate, ownerDashboardController.getDashboard.bind(ownerDashboardController));
router.get('/owner/restaurants', authenticate, ownerDashboardController.getMyRestaurants.bind(ownerDashboardController));
router.get('/owner/restaurants/:id', authenticate, ownerDashboardController.getMyRestaurantById.bind(ownerDashboardController));

// Review response routes
router.post('/reviews/:id/response', authenticate, reviewResponseController.createResponse.bind(reviewResponseController));
router.put('/review-responses/:id', authenticate, reviewResponseController.updateResponse.bind(reviewResponseController));
router.delete('/review-responses/:id', authenticate, reviewResponseController.deleteResponse.bind(reviewResponseController));

// Notification routes
router.get('/notifications', authenticate, notificationController.getNotifications.bind(notificationController));
router.put('/notifications/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/notifications/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));

// Enhanced import routes
router.get('/admin/import/restaurants/search', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), enhancedImportController.searchRestaurants.bind(enhancedImportController));
router.post('/admin/import/restaurants/preview', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), enhancedImportController.previewImport.bind(enhancedImportController));
router.post('/admin/import/restaurants', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), enhancedImportController.importRestaurants.bind(enhancedImportController));
router.get('/admin/import/restaurants/history', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), enhancedImportController.getImportHistory.bind(enhancedImportController));


// Admin dashboard
router.get(
  '/admin/dashboard',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'),
  adminController.getDashboard.bind(adminController)
);

// Admin user management
router.get('/admin/users', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.getUsers.bind(adminController));
router.put('/admin/users/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.updateUserStatus.bind(adminController));
router.put('/admin/users/:id/roles', authenticate, authorize('SUPER_ADMIN'), adminController.updateUserRoles.bind(adminController));

// Admin restaurant moderation
router.get('/admin/restaurants', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), adminController.getRestaurants.bind(adminController));
router.put('/admin/restaurants/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.updateRestaurantStatus.bind(adminController));
router.put('/admin/restaurants/:id/verify', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.verifyRestaurant.bind(adminController));

// Admin review moderation
router.get('/admin/reviews', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), adminController.getReviews.bind(adminController));
router.put('/admin/reviews/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), adminController.updateReviewStatus.bind(adminController));
router.delete('/admin/reviews/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.deleteReview.bind(adminController));

// Email verification & password reset
router.post('/auth/verify-email', authController.verifyEmail.bind(authController));
router.post('/auth/forgot-password', authController.forgotPassword.bind(authController));
router.post('/auth/reset-password', authController.resetPassword.bind(authController));
router.post('/auth/resend-verification', authenticate, authController.resendVerification.bind(authController));

// Admin restaurant claims
router.get(
  '/admin/restaurant-claims',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  adminController.getRestaurantClaims.bind(adminController)
);
router.put(
  '/admin/restaurant-claims/:id/approve',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  adminController.approveClaim.bind(adminController)
);
router.put(
  '/admin/restaurant-claims/:id/reject',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  adminController.rejectClaim.bind(adminController)
);

// Admin import routes
router.post('/admin/import/restaurants', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), importController.importRestaurants.bind(importController));
router.post('/admin/import/communes', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), importController.importCommunes.bind(importController));
router.post('/admin/import/dairas', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), importController.importDairas.bind(importController));

// Reports
router.post('/reports', authenticate, reportController.submitReport.bind(reportController));
router.get('/admin/reports', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), reportController.getReports.bind(reportController));
router.put('/admin/reports/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'MODERATOR'), reportController.updateReportStatus.bind(reportController));

// Category routes
router.get('/categories', categoryController.getCategories.bind(categoryController));

// Cuisine routes
router.get('/cuisines', cuisineController.getCuisines.bind(cuisineController));

// Wilaya routes
router.get('/wilayas', wilayaController.getWilayas.bind(wilayaController));
router.get('/wilayas/:id/communes', wilayaController.getCommunesByWilaya.bind(wilayaController));
router.get('/wilayas/:id/dairas', wilayaController.getDairasByWilaya.bind(wilayaController));

export default router;