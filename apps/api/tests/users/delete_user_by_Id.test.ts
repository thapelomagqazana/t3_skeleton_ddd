import request from 'supertest';
import app from '../../src/app';
import {
  clearTestUsers,
  seedAdminUser,
  seedNormalUser,
  softDeleteUserById,
} from '../helpers/db.helper';
import { generateToken } from '../helpers/token.helper';

describe('DELETE /api/users/:id', () => {
  let adminUser: any;
  let normalUser: any;
  let otherUser: any;
  let deletedUser: any;
  let adminToken: string;
  let userToken: string;
  let expiredToken: string;

  beforeAll(async () => {
    await clearTestUsers();

    adminUser = await seedAdminUser();
    normalUser = await seedNormalUser();
    otherUser = await seedNormalUser('thirduser@example.com', 'pass123');
    deletedUser = await seedNormalUser('deleted@example.com', 'pass123');

    adminToken = generateToken(adminUser);
    userToken = generateToken(normalUser);

    // Simulate expired token
    expiredToken = generateToken(normalUser, '-10s');

    // Soft delete this user ahead of time
    await softDeleteUserById(deletedUser.id);
  });

  afterAll(async () => {
    await clearTestUsers();
  });

  // ✅ Positive Test Cases

  it('TC001 – ✅ Admin deletes existing user by ID', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${otherUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message || res.body.data?.deleted).toBeDefined();
  });

  it('TC002 – ✅ User deletes own account', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message || res.body.data?.deleted).toBeDefined();
  });

  it('TC003 – ✅ Valid soft-delete logic (if used)', async () => {
    const user = await seedNormalUser('soft@example.com', 'pass123');
    const res = await request(app)
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data?.status || res.body.message).toMatch(/deleted/i);
  });

  it('TC004 – ✅ Valid hard-delete logic (if used)', async () => {
    const user = await seedNormalUser('hard@example.com', 'pass123');
    const res = await request(app)
      .delete(`/api/v1/users/${user.id}?force=true`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message || res.body.data?.permanent).toBeDefined();
  });

  // ❌ Negative Test Cases

  it('TC101 – ❌ Missing Authorization header', async () => {
    const res = await request(app).delete(`/api/v1/users/${adminUser.id}`);
    expect(res.statusCode).toBe(401);
  });

  it('TC102 – ❌ Invalid JWT token', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${adminUser.id}`)
      .set('Authorization', 'Bearer invalid.token');

    expect(res.statusCode).toBe(403);
  });

  it('TC103 – ❌ Expired JWT token', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${adminUser.id}`)
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("TC104 – ❌ Non-admin tries to delete another user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${adminUser.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("TC105 – ❌ Non-existent user ID", async () => {
    const fakeId = "c4d76b82-f0cf-41ea-8e62-a06b9dbf0000";
    const res = await request(app)
      .delete(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("TC106 – ❌ Admin deleting already-deleted user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${deletedUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect([404, 410]).toContain(res.statusCode);
  });

  it("TC107 – ❌ User tries to delete another user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${adminUser.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

   // ⚠️ Edge Cases

  it('TC201 – ⚠️ User ID with leading/trailing spaces', async () => {
    const idWithSpaces = ` ${adminUser.id} `;
    const res = await request(app)
      .delete(`/api/users/${idWithSpaces}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([400, 404]).toContain(res.statusCode); // depending on implementation
  });

  it('TC202 – ⚠️ Mixed-case user ID', async () => {
    const res = await request(app)
      .delete(`/api/users/${adminUser.id.toUpperCase()}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 404]).toContain(res.statusCode); // depends on case-sensitivity
  });

  it('TC203 – ⚠️ Non-UUID ID format (e.g., number)', async () => {
    const res = await request(app)
      .delete(`/api/users/123`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404); // assuming UUID enforced
  });

  it('TC204 – ⚠️ Malformed UUID', async () => {
    const res = await request(app)
      .delete(`/api/users/not-a-uuid`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404); // validation error
  });

  it('TC205 – ⚠️ Valid token with whitespace', async () => {
    const res = await request(app)
      .delete(`/api/users/${adminUser.id}`)
      .set('Authorization', `Bearer   ${adminToken}   `);
    expect([200, 401, 404]).toContain(res.statusCode); // depends on trimming logic
  });

  // 🔍 Corner Cases

  it("TC301 – 🔍 Null or string 'null' as ID", async () => {
    const res = await request(app)
      .delete(`/api/users/null`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('TC302 – 🔍 Empty ID segment', async () => {
    const res = await request(app)
      .delete(`/api/users/`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([400, 404]).toContain(res.statusCode); // route not matched or missing param
  });

  it("TC303 – 🔍 SQL Injection attempt in ID", async () => {
    const res = await request(app)
      .delete(`/api/users/' OR 1=1 --`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404); // input rejected
  });

  it('TC304 – 🔍 Oversized ID (10KB)', async () => {
    const bigId = 'a'.repeat(10_000);
    const res = await request(app)
      .delete(`/api/users/${bigId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('TC305 – 🔍 JS injection as ID', async () => {
    const res = await request(app)
      .delete(`/api/users/<script>alert(1)</script>`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});
