import prisma from '../../src/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

const TEST_USER_EMAILS = [
  'john@example.com',
  'jane@example.com', // normalized lowercase
  'test@example.com',
  'short@example.com',
  'notanemail',
  'existing@example.com',
  'a@example.com',
  'edge@example.com',
  'spe@cial.com',
  'trim@example.com',
  'long@example.com',
  "' OR 1=1--",
  'safe@example.com',
  'admin@example.com', 
  'user@example.com',
  "otheruser@example.com",
  'multifield@example.com',
  'thirduser@example.com',
  'deleted@example.com',
  'soft@example.com',
  'hard@example.com',
];

export const clearTestUsers = async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: TEST_USER_EMAILS.map(email => email.toLowerCase()),
      },
    },
  });
};

export const seedUser = async (email = 'existing@example.com', password = 'secret123') => {
  const hashedPassword =
    process.env.SKIP_HASH === 'true' ? password : await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Existing User',
      email,
      password: hashedPassword,
    },
  });
};

export const seedAdminUser = async () => {
  return await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpass',
      role: Role.ADMIN,
      isActive: true,
    },
  });
};

export const seedNormalUser = async (email: string = 'user@example.com', password: string = 'testpass123') => {
  return await prisma.user.create({
    data: {
      name: 'Normal User',
      email,
      password,
      role: Role.USER,
      isActive: true,
    },
  });
};

/**
 * Marks a user as soft-deleted (e.g., sets `active` to false or `isDeleted` to true).
 * @param userId UUID of the user to soft-delete
 * @returns Updated user object
 */
export async function softDeleteUserById(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false, // or active: false, depending on your schema
    },
  });
}