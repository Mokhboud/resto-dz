import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../api/client';

export default function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState('GENERAL');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/feedback', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Thank you for your feedback! We will review it shortly.');
      setMessage('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!message.trim()) {
      setError('Please enter your feedback message.');
      return;
    }
    submitMutation.mutate({ feedbackType, message, rating });
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-bold text-lg mb-4">📝 Feedback</h3>
      <p className="text-sm text-gray-500 mb-4">
        Found a bug? Have a suggestion? Let us know!
      </p>

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-3 text-sm">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-3 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="GENERAL">💬 General Feedback</option>
            <option value="BUG">🐛 Bug Report</option>
            <option value="FEATURE_REQUEST">💡 Feature Request</option>
            <option value="PROBLEM">😕 Having a Problem</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Good</option>
            <option value={3}>⭐⭐⭐ Average</option>
            <option value={2}>⭐⭐ Poor</option>
            <option value={1}>⭐ Very Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Tell us what's working or what needs improvement..."
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}