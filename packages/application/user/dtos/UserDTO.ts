import { User } from '@domain/user/entities/User';

export function toUserResponse(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email.getValue(),
    role: user.role,
    createdAt: user.createdAt,
  };
}