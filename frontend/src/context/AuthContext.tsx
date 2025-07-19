/**
 * @file AuthContext.ts
 * @description Defines the AuthContext only. No component logic.
 */

import { createContext } from 'react';

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role?: string;
};

export type AuthContextType = {
  readonly user: User | null;
  readonly token: string | null;
  readonly signin: (data: { token: string; user: User }) => void;
  readonly signout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
