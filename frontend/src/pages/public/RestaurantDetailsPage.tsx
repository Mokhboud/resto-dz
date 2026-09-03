import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { useAuthStore } from '../../stores/authStore';
import PhotoGallery from '../../components/restaurants/PhotoGallery';
import PhotoUpload from '../../components/restaurants/PhotoUpload';
import { apiClient } from '../../api/client';

export default function RestaurantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimPhone, setClaimPhone] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  const claimMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(`/restaurants/${id}/claim`, data);
      return response.data;
    },
    onSuccess: () => {
      setClaimSuccess('Your claim request has been submitted. We will review it shortly.');
      setShowClaimForm(false);
      setClaimPhone('');
      setClaimNotes('');
      setClaimError('');
    },
    onError: (err: any) => {
      setClaimError(err.response?.data?.message || 'Claim submission failed');
    },
  });

  const isOwner = user?.roles?.some(r => ['RESTAURANT_OWNER', 'ADMIN', 'SUPER_ADMIN'].includes(r));

  const { data: restaurantData, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantsApi.getRestaurantById(id!),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['restaurant-reviews', id],
    queryFn: () => restaurantsApi.getRestaurantReviews(id!),
    enabled: !!id,
  });

  const favoriteMutation = useMutation({
    mutationFn: () => restaurantsApi.addFavorite(id!),
    onSuccess: () => {
      alert('Added to favorites!');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (data: any) => restaurantsApi.createReview(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
      setShowReviewForm(false);
      setReviewComment('');
      alert('Review submitted!');
    },
  });

  const restaurant = restaurantData?.data;
  const reviews = reviewsData?.data || [];

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-12">Restaurant not found</div>;
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    reviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-500 mt-1">
              {restaurant.wilaya_name} • {restaurant.address}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-500">
              ⭐ {parseFloat(restaurant.avg_rating || '0').toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">
              ({restaurant.review_count} reviews)
            </div>
          </div>
        </div>

        {restaurant.verified && (
          <div className="mt-3 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            ✓ Verified Restaurant
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {restaurant.categories?.map((cat: any) => (
            <span key={cat.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {cat.icon} {cat.name_en}
            </span>
          ))}
          {restaurant.cuisines?.map((cui: any) => (
            <span key={cui.id} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
              {cui.icon} {cui.name_en}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => favoriteMutation.mutate()}
            disabled={!isAuthenticated}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50"
          >
            ❤️ Favorite
          </button>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            disabled={!isAuthenticated}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            ✍️ Write Review
          </button>
        </div>
      </div>

      {/* Claim Restaurant Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-yellow-800">🏪 Are you the owner of this restaurant?</h2>
            <p className="text-sm text-yellow-700 mt-1">
              Claim this restaurant to manage your profile, update information, respond to reviews, and more.
            </p>
          </div>
          <button
            onClick={() => setShowClaimForm(!showClaimForm)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 whitespace-nowrap"
          >
            Claim This Restaurant
          </button>
        </div>

        {showClaimForm && (
          <div className="mt-4 border-t border-yellow-200 pt-4">
            {claimError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-3 text-sm">{claimError}</div>
            )}
            {claimSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-3 text-sm">{claimSuccess}</div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                value={claimPhone}
                onChange={(e) => setClaimPhone(e.target.value)}
                placeholder="Your phone number"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <textarea
                value={claimNotes}
                onChange={(e) => setClaimNotes(e.target.value)}
                placeholder="Additional notes (optional)"
                rows={3}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please login or register to claim this restaurant.');
                    return;
                  }
                  claimMutation.mutate({ phone: claimPhone, notes: claimNotes });
                }}
                disabled={claimMutation.isPending}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
              >
                {claimMutation.isPending ? 'Submitting...' : 'Submit Claim Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">📸 Photos</h2>
        <PhotoGallery restaurantId={restaurant.id} isOwner={isOwner} />
        
        {isOwner && (
          <div className="mt-4">
            <PhotoUpload restaurantId={restaurant.id} />
          </div>
        )}
      </div>

      {/* Opening Hours */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">🕐 Opening Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {(restaurant.opening_hours || []).map((hours: any) => (
            <div key={hours.day_of_week} className="flex justify-between text-sm">
              <span className="font-medium">{daysOfWeek[hours.day_of_week]}</span>
              <span className="text-gray-600">
                {hours.is_closed ? 'Closed' : `${hours.open_time?.slice(0, 5)} - ${hours.close_time?.slice(0, 5)}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} ⭐
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">💬 Reviews ({restaurant.review_count})</h2>
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center py-6">No reviews yet</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold">
                      {review.reviewer_first_name} {review.reviewer_last_name}
                    </span>
                    <span className="text-yellow-500 ml-2">
                      ⭐ {parseFloat(review.overall_rating || '0').toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}