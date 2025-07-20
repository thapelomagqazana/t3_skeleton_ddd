/**
 * @file Dashboard.tsx
 * @description Protected dashboard page shown after successful authentication.
 * Uses the AuthContext to show user-specific data and actions.
 */

import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard page component.
 * Accessible only to authenticated users.
 */
export default function Dashboard() {
  const { user } = useAuth(); // Authenticated user from global context

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold mb-4">
          Welcome back{user ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Here’s your dashboard. Manage your account and explore the app.
        </p>

        {/* Dashboard Sections */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Name:</span> {user?.name || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user?.email || 'N/A'}
            </p>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Update your profile</li>
              <li>Change your password</li>
              <li>View API activity</li>
              <li>Sign out securely</li>
            </ul>
          </div>
        </section>

        {/* Activity Logs Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600 italic">
            No activity to display yet. Interact with the system to see logs.
          </p>
        </section>
      </div>
    </main>
  );
}
