/**
 * @file auth.ts
 * @description API client for authentication-related HTTP requests using Axios instance.
 */

import axiosInstance from '../lib/axiosInstance';

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

/**
 * Registers a new user by sending name, email, and password.
 */
export const signUp = async (payload: SignUpPayload) => {
  const response = await axiosInstance.post('/auth/signup', payload);
  console.log(response);
  return response.data;
};

/**
 * Logs in a user using email and password credentials.
 */
export const signIn = async (payload: SignInPayload) => {
  const response = await axiosInstance.post('/auth/signin', payload);
  return response.data;
};

/**
 * Logs out a user using the provided JWT token (auto-attached via interceptor).
 */
export const signOut = async () => {
  const response = await axiosInstance.post('/auth/signout');
  return response.data;
};
