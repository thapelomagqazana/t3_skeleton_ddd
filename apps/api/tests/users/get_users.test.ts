import request from 'supertest';
import app from '../../src/app';
import { clearTestUsers, seedAdminUser, seedNormalUser } from '../helpers/db.helper';
import { generateToken } from '../helpers/token.helper';
import { User } from '@prisma/client';

let adminToken: string;
let userToken: string;
let admin: User;

beforeAll(async () => {
  await clearTestUsers();
  admin = await seedAdminUser();       // creates an admin user in DB
  const user = await seedNormalUser();       // creates a normal user in DB

  adminToken = generateToken(admin);         // generates JWT
  userToken = generateToken(user);
});

afterAll(async () => {
  await clearTestUsers();
});

describe('GET /api/v1/users', () => {
  // ✅ Positive Test Cases

  it('TC001 – ✅ Valid request with admin auth token', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('TC002 – ✅ Valid request with pagination', async () => {
    const res = await request(app)
      .get('/api/v1/users?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body.users.length).toBeLessThanOrEqual(10);
  });

  it('TC003 – ✅ Valid request with filters', async () => {
    const res = await request(app)
      .get('/api/v1/users?role=user&active=true')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('TC004 – ✅ Valid request with search query', async () => {
    const res = await request(app)
      .get('/api/v1/users?search=John')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  // ❌ Negative Test Cases

  it('TC101 – ❌ No Authorization header', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });

  it('TC102 – ❌ Malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('TC103 – ❌ Expired token', async () => {
    const expiredToken = generateToken(admin, '-1h');
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/expired/i);
  });

  it('TC104 – ❌ Non-admin user access', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error.message).toMatch(/forbidden/i);
  });

  it('TC105 – ❌ Invalid pagination input', async () => {
    const res = await request(app)
      .get('/api/v1/users?page=-1&limit=abc')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toMatch(/invalid/i);
  });

  // ⚠️ Edge Test Cases

  it('TC201 – ⚠️ Page = 0', async () => {
    const res = await request(app)
      .get('/api/v1/users?page=0')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect([400, 200]).toContain(res.statusCode);
  });

  it('TC202 – ⚠️ Large limit (e.g., 1000)', async () => {
    const res = await request(app)
      .get('/api/v1/users?limit=1000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBeLessThanOrEqual(100); // assuming API caps limit
  });

  it('TC203 – ⚠️ Mixed case query param keys', async () => {
    const res = await request(app)
      .get('/api/v1/users?Page=1&Limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 400]).toContain(res.statusCode);
  });

  it('TC204 – ⚠️ Invalid filter values', async () => {
    const res = await request(app)
      .get('/api/v1/users?active=maybe&role=superadmin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toMatch(/invalid/i);
  });

  it('TC205 – ⚠️ Token with whitespace', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer    ${adminToken}   `);

    expect(res.statusCode).toBe(200);
  });

  // 🔍 Corner Test Cases

  it('TC301 – 🔍 Empty query params', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('TC302 – 🔍 Null token in Authorization header', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer null');

    expect(res.statusCode).toBe(403);
  });

  it('TC303 – 🔍 Extra unknown query params', async () => {
    const res = await request(app)
      .get('/api/v1/users?foo=bar')
      .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 400]).toContain(res.statusCode);
  });

  it('TC304 – 🔍 Auth header using wrong scheme', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Basic xyz');

    expect(res.statusCode).toBe(401);
  });

  it('TC305 – 🔍 Token with invalid signature', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.invalid.signature');

    expect(res.statusCode).toBe(403);
  });

});
