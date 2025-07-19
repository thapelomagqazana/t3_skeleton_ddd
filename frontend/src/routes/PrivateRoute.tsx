/**
 * @file PrivateRoute.tsx
 * @description Wrapper component to protect routes by checking authentication.
 */

import { Navigate, Outlet } from 'react-router-dom';

/**
 * A simple function to check if the user is authenticated.
 * You may later replace this with context or JWT validation logic.
 */
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token'); // JWT or session token
  return !!token;
};

/**
 * Renders the protected route or redirects to signin.
 */
export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace />;
}
