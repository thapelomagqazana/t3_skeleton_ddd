/**
 * @file SignUp.test.tsx
 * @description Unit tests for the SignUp component using RTL + Jest.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../pages/SignUp';
import { AuthProvider } from '../context/AuthProvider';
import { signUp as mockSignUp } from '../api/auth';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';

// Mock auth API
jest.mock('../api/auth', () => ({
  signUp: jest.fn(),
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock AuthContext
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signin: jest.fn(),
  }),
}));

// ✅ Clean: Single definition
const renderWithProviders = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('SignUp Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    renderWithProviders();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows API error if signup fails', async () => {
    (mockSignUp as jest.Mock).mockResolvedValueOnce({ error: 'Email already exists' });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Thapelo' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'thapelo@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  it('calls signin and shows success toast on successful signup', async () => {
    (mockSignUp as jest.Mock).mockResolvedValueOnce({
      token: 'abc123',
      user: { id: '1', email: 'thapelo@example.com' },
    });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Thapelo' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'thapelo@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: 'Thapelo',
        email: 'thapelo@example.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Signed up successfully!');
    });
  });

  it('handles unexpected network errors gracefully', async () => {
    (mockSignUp as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Thapelo' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'thapelo@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred during signup.');
    });
  });
});
