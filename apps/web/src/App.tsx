/**
 * @file App.tsx
 * @description Root router managing auth page routes.
 */

import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Root App component handling public routes for authentication pages.
 */
function App() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<div className="p-6">404 - Page Not Found</div>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
