import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    apiClient.get('/health').catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const wakeTimer = setTimeout(() => setWaking(true), 3000);

    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      clearTimeout(wakeTimer);
      setWaking(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
            placeholder="Your password"
            className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {isLoading && !waking && (
          <p className="mt-3 text-sm text-gray-500 text-center">
            Signing you in...
          </p>
        )}

        {waking && (
          <p className="mt-3 text-sm text-amber-600 text-center">
            Waking up the server. First request after a pause can take up
            to 60 seconds. Please don't close this page.
          </p>
        )}
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-orange-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
