/**
 * @file AuthProvider.tsx
 * @description Provides global auth state using React Context API.
 */

import {
  useState,
  useEffect,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from './AuthContext';

type User = NonNullable<AuthContextType['user']>;

export const AuthProvider: FC<{ readonly children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signin = (data: { token: string; user: User }) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/dashboard');
  };

  const signout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const value = useMemo<AuthContextType>(() => ({ user, token, signin, signout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
