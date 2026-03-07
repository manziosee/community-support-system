import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-1">
          <p className="text-8xl font-extrabold text-black dark:text-white tracking-tight">404</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">Page not found</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Go back
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:opacity-80 transition-opacity"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;