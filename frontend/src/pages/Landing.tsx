/**
 * @file Landing.tsx
 * @description Public landing page showcasing the T3-skeleton app with navigation to auth routes.
 */

import { Link } from 'react-router-dom';
import { APP_NAME } from '../config/constants';

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          Welcome to <span className="text-blue-600">{APP_NAME}</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A secure, modern, and scalable boilerplate built with Express, Prisma, React, Tailwind, and TypeScript.
        </p>

        {/* Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/signin"
            className="text-blue-600 font-medium py-3 px-6 border border-blue-600 rounded-xl hover:bg-blue-50 transition"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
