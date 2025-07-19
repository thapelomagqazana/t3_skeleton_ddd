import request from 'supertest';
import app from '../../src/app';
import { clearTestUsers, seedAdminUser, seedNormalUser } from '../helpers/db.helper';
import { generateToken } from '../helpers/token.helper';


describe('GET /api/v1/users/:id', () => {
  let adminUser: any;
  let normalUser: any;
  let otherUser: any;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await clearTestUsers();
    adminUser = await seedAdminUser();
    normalUser = await seedNormalUser();
    otherUser = await seedNormalUser("otheruser@example.com", "testpass123");

    adminToken = generateToken(adminUser);
    userToken = generateToken(normalUser);
  });

  afterAll(async () => {
    await clearTestUsers();
  });

  // ✅ Positive Tests
  it('TC001 – ✅ Valid user ID (admin token)', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${otherUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('id', otherUser.id);
  });

  it('TC002 – ✅ Valid user ID (self-access)', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('id', normalUser.id);
  });

  // ❌ Negative Tests
  it('TC101 – ❌ Missing Authorization header', async () => {
    const res = await request(app).get(`/api/v1/users/${normalUser.id}`);
    expect(res.statusCode).toBe(401);
  });

  it('TC102 – ❌ Invalid JWT token', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', 'Bearer this.is.invalid');

    expect(res.statusCode).toBe(403);
  });

  it('TC103 – ❌ Expired JWT token', async () => {
    const expiredToken = generateToken(
      normalUser,
      '-1s'
    );

    const res = await request(app)
      .get(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('TC104 – ❌ Valid token but requesting others’ ID (non-admin)', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${otherUser.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('TC105 – ❌ Non-existent user ID', async () => {
    const res = await request(app)
      .get(`/api/v1/users/99999999-9999-9999-9999-999999999999`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
  });

  it('TC201 – ⚠️ User ID with leading/trailing spaces', async () => {
    const id = ` ${normalUser.id} `;
    const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200); // or 404 if not trimmed
    });

    it('TC202 – ⚠️ User ID in uppercase', async () => {
    const upperId = normalUser.id.toUpperCase();
    const res = await request(app)
        .get(`/api/v1/users/${upperId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 404]).toContain(res.statusCode); // depends on backend ID casing strategy
    });

    it('TC203 – ⚠️ User ID as integer instead of UUID', async () => {
    const res = await request(app)
        .get(`/api/v1/users/123`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400); // invalid UUID format
    });

    it('TC204 – ⚠️ Malformed UUID', async () => {
    const res = await request(app)
        .get(`/api/v1/users/invalid-uuid-format`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    });

    it('TC205 – ⚠️ Token with whitespace', async () => {
    const res = await request(app)
        .get(`/api/v1/users/${normalUser.id}`)
        .set('Authorization', `Bearer   ${adminToken}   `);

    expect(res.statusCode).toBe(200); // Only if token is trimmed correctly
    });

});
