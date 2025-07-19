/**
 * @file SignIn.test.tsx
 * @description Unit tests for the SignIn component using RTL + Jest.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/SignIn';
import { AuthProvider } from '../context/AuthProvider';
import { signIn as mockSignIn } from '../api/auth';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../api/auth', () => ({
  signIn: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signin: jest.fn(),
  }),
}));

const renderWithProviders = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('SignIn Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    renderWithProviders();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error if credentials are invalid', async () => {
    (mockSignIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('calls signin and shows success toast on valid response', async () => {
    (mockSignIn as jest.Mock).mockResolvedValueOnce({
      token: 'abc123',
      user: { id: '1', email: 'test@example.com' },
    });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '123456',
      });
      expect(toast.success).toHaveBeenCalledWith('Signed in successfully');
    });
  });

  it('handles network or unexpected errors gracefully', async () => {
    (mockSignIn as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred while signing in');
    });
  });
});
