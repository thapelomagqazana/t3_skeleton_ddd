/**
 * @file SignOut.tsx
 * @description Stateless Sign Out page that clears token and updates global auth state.
 */

import { useEffect, useState } from 'react';
import { signOut as signOutAPI } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * SignOut component clears auth state and notifies the backend.
 */
export default function SignOut() {
  const [message, setMessage] = useState('Signing you out...');
  const { signout, token } = useAuth();
  const toastId = 'signout-toast';

  /**
   * Triggers signout logic on component mount.
   */
  useEffect(() => {
    const performSignout = async () => {
      try {
        if (token) {
          await signOutAPI(); // Notify backend (optional)
        }

        signout(); // Clear context, localStorage, and redirect
        toast.dismiss(toastId); // Prevent duplicate
        toast.success('Signed out successfully.', { toastId });
        setMessage('');
      } catch (error) {
        console.error('Signout Error:', error);
        toast.dismiss(toastId);
        toast.error('Error during sign-out. Please try again.', { toastId });
        setMessage('Error during sign-out. Please try again.');
      }
    };

    performSignout();
  }, [signout, token]);

  return (
    <div className="max-w-md mx-auto p-6 text-center text-gray-700">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
