/**
 * @file SignIn.tsx
 * @description Sign In page for user login using RHF + Zod.
 */

import { useAuth } from '../hooks/useAuth';
import { signIn } from '../api/auth';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof schema>;

export default function SignIn() {
  const { signin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signIn({
        email: data.email.trim(),
        password: data.password,
      });

      if (response.token && response.user) {
        signin({ token: response.token, user: response.user });
        toast.success('Signed in successfully');
      } else {
        toast.error(response.error || 'Invalid credentials. Please try again.');
      }
    } catch (error: unknown) {
      let backendMessage = 'An error occurred while signing in';

      if (error instanceof AxiosError && error.response?.data?.error?.message) {
        backendMessage = error.response.data.error.message;
      }
      toast.error(backendMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <label htmlFor="email">Email</label>
            <input
            id="email"
            {...register('email')}
            type="email"
            className="w-full border px-3 py-2 rounded"
            />
            {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
        </div>

        <div>
            <label htmlFor="password">Password</label>
            <input
            id="password"
            {...register('password')}
            type="password"
            className="w-full border px-3 py-2 rounded"
            />
            {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded transition text-white ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

    </div>
  );
}
