import { User } from '@domain/user/entities/User';
import { Email } from '@domain/valueObjects/Email';

export class UserMapper {
  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  static toDomain(raw: any): User {
    return new User(
      raw.id,
      raw.name,
      new Email(raw.email),
      raw.password,
      raw.role,
      raw.isActive,
      raw.createdAt
    );
  }
}
