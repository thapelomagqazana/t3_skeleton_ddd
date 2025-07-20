/**
 * @file SignUp.tsx
 * @description Sign Up page with React Hook Form + Zod validation
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof schema>;

export default function SignUp() {
  const { signin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await signUp(data);
      if (res.token && res.user) {
        signin({ token: res.token, user: res.user });
        toast.success('Signed up successfully!');
      } else {
        toast.error(res.error || 'Signup failed.');
      }
    } catch (error: unknown) {
      let backendMessage = 'Something went wrong';

      if (error instanceof AxiosError && error.response?.data?.error?.message) {
        backendMessage = error.response.data.error.message;
      }
      toast.error(backendMessage);
    }
  
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
        <label htmlFor="name">Name</label>
        <input
            id="name"
            {...register('name')}
            className="w-full border px-3 py-2 rounded"
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
        <label htmlFor="email">Email</label>
        <input
            id="email"
            {...register('email')}
            type="email"
            className="w-full border px-3 py-2 rounded"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        <div>
        <label htmlFor="password">Password</label>
        <input
            id="password"
            {...register('password')}
            type="password"
            className="w-full border px-3 py-2 rounded"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
