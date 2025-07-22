import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';
import { Email } from '@domain/valueObjects/Email';
import { UserMapper } from './UserMapper';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Implements IUserRepository using Prisma ORM.
 */
export class UserRepository implements IUserRepository {
  async findAll({
    role,
    active,
    search,
    page = 1,
    limit = 10,
  }: {
    role?: string;
    active?: string | boolean;
    search?: string;
    page?: number;
    limit?: number;
    } = {}): Promise<User[]> {
    const where: any = {};

    if (role) {
        const upperRole = role.toUpperCase();

        if (Object.values(Role).includes(upperRole as Role)) {
            where.role = upperRole as Role;
        } else {
            throw new Error(`Invalid role filter: ${role}`);
        }
    }


    if (typeof active === 'string') {
    const normalized = active.toLowerCase().trim();
    if (normalized === 'true') {
        where.isActive = true;
    } else if (normalized === 'false') {
        where.isActive = false;
    } else {
        throw new Error(`Invalid value for 'active': ${active}`);
    }
    } else if (typeof active === 'boolean') {
    where.isActive = active;
    }
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const users = await prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
    });

        return users.map(
            u =>
            new User(
                u.id,
                u.name,
                new Email(u.email),
                u.password,
                u.role,
                u.isActive,
                u.createdAt
            )
        );
    }



  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? new User(u.id, u.name, new Email(u.email), u.password, u.role, u.isActive, u.createdAt) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    return u ? new User(u.id, u.name, new Email(u.email), u.password, u.role, u.isActive, u.createdAt) : null;
  }

  async save(user: User): Promise<User> {
    const saved = await prisma.user.create({
        data: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const updated = await prisma.user.update({
        where: { id: user.id },
        data: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
