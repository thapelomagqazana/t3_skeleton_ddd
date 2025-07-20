import request from 'supertest';
import app from '../../src/app';
import { clearTestUsers, seedAdminUser, seedNormalUser } from '../helpers/db.helper';
import { generateToken } from '../helpers/token.helper';

describe('PUT /api/v1/users/:id', () => {
  let adminUser: any;
  let normalUser: any;
  let otherUser: any;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await clearTestUsers();
    adminUser = await seedAdminUser();
    normalUser = await seedNormalUser();
    otherUser = await seedNormalUser('otheruser@example.com', 'testpass123');

    adminToken = generateToken(adminUser);
    userToken = generateToken(normalUser);
  });

  afterAll(async () => {
    await clearTestUsers();
  });

  // ✅ Positive Test Cases
  it('TC001 – ✅ Update user name with admin token', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
  });

  it('TC002 – ✅ User updates their own profile', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Self Edit' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Self Edit');
  });

  it('TC003 – ✅ Update multiple fields at once', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Multi Field',
        email: 'multifield@example.com',
        isActive: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('multifield@example.com');
    expect(res.body.user.name).toBe('Multi Field');
  });

  it('TC004 – ✅ Valid update with trimmed fields', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '   John Doe   ' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('John Doe');
  });

  // ❌ Negative Test Cases
  it('TC101 – ❌ Missing auth header', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .send({ name: 'No Auth' });

    expect(res.statusCode).toBe(401);
  });

  it('TC102 – ❌ Invalid JWT token', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', 'Bearer invalid.token.here')
      .send({ name: 'Bad Token' });

    expect(res.statusCode).toBe(403);
  });

  it('TC103 – ❌ Expired token', async () => {
    const expiredToken = generateToken(normalUser, '-1h'); // Adjust helper to support expiry
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ name: 'Expired Token' });

    expect(res.statusCode).toBe(403);
  });

  it('TC104 – ❌ User tries to update another user', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${otherUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacked' });

    expect(res.statusCode).toBe(403);
  });

  it('TC105 – ❌ Non-existent user ID', async () => {
    const res = await request(app)
      .put('/api/v1/users/507f1f77bcf86cd799439011') // fake valid ObjectId
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost' });

    expect(res.statusCode).toBe(400);
  });

  it('TC106 – ❌ Invalid payload', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'invalid-email' });

    expect(res.statusCode).toBe(400);
  });

  it('TC107 – ❌ Empty body', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

    // ⚠️ Edge Test Cases
  it('TC201 – ⚠️ Leading/trailing spaces in ID param', async () => {
    const res = await request(app)
      .put(`/api/v1/users/  ${normalUser.id}  `)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Trim ID' });

    expect([400, 404, 200]).toContain(res.statusCode); // depending on routing setup
  });

  it('TC202 – ⚠️ Mixed-case user ID', async () => {
    const mixedId = normalUser.id.toUpperCase(); // assuming UUID or case-insensitive
    const res = await request(app)
      .put(`/api/v1/users/${mixedId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Case Test' });

    expect([200, 404]).toContain(res.statusCode); // DB config dependent
  });

  it('TC203 – ⚠️ Payload with extra unknown field', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nickname: 'Johnny' });

    expect([400, 200]).toContain(res.statusCode); // schema .strict() or not
  });

  it('TC204 – ⚠️ Long input for name/email', async () => {
    const longName = 'a'.repeat(255);
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: longName });

    expect([400, 200]).toContain(res.statusCode); // schema max() enforced?
  });

  it('TC205 – ⚠️ Valid token with leading/trailing whitespace', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer   ${adminToken}   `)
      .send({ name: 'Trim Token' });

    expect([200, 401]).toContain(res.statusCode); // middleware handling
  });

  // 🔍 Corner Test Cases
  it("TC301 – 🔍 ID is null or string 'null'", async () => {
    const res = await request(app)
      .put(`/api/v1/users/null`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Null ID' });

    expect(res.statusCode).toBe(400);
  });

  it('TC302 – 🔍 ID is empty string', async () => {
    const res = await request(app)
      .put(`/api/v1/users/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Empty ID' });

    expect([404, 400]).toContain(res.statusCode);
  });

  it("TC303 – 🔍 ID with SQL injection attempt", async () => {
    const res = await request(app)
      .put(`/api/v1/users/' OR 1=1 --`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'SQL Attack' });

    expect(res.statusCode).toBe(400);
  });

  it('TC304 – 🔍 Oversized ID', async () => {
    const hugeId = 'a'.repeat(10000);
    const res = await request(app)
      .put(`/api/v1/users/${hugeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Oversized' });

    expect(res.statusCode).toBe(400);
  });

  it.skip('TC305 – 🔍 JS injection in name field', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '<script>alert(1)</script>' });

    expect([400, 422]).toContain(res.statusCode); // if sanitization or validation applied
  });

});
