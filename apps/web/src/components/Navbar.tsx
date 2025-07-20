/**
 * @file Navbar.tsx
 * @description Global navigation bar with links based on auth state.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../config/constants';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Logo or App Name */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        {APP_NAME}
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 text-sm">
        {!user ? (
          <>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">
              Sign Up
            </Link>
            <Link to="/signin" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/signout" className="text-gray-700 hover:text-red-500">
              Sign Out
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
