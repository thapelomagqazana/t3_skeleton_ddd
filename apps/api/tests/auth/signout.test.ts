import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/db';
import { clearTestUsers, seedUser } from '../helpers/db.helper';

let validToken: string;

describe('POST /api/v1/auth/signout', () => {
  beforeEach(async () => {
    await clearTestUsers();
    await seedUser('signoutuser@example.com', 'testpass123');

    const res = await request(app).post('/api/v1/auth/signin').send({
      email: 'signoutuser@example.com',
      password: 'testpass123',
    });

    validToken = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ✅ Positive
  it('TC001 – ✅ Valid sign-out with active JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: expect.any(String),
    });
  });

  it('TC002 – ✅ Sign out when token is still valid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${validToken}`); // Still valid unless blacklisting

    expect([200, 401]).toContain(res.statusCode);
  });

  it('TC003 – ✅ Multiple signouts with same token', async () => {
    // First signout
    const first = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${validToken}`);
    expect([200, 401]).toContain(first.statusCode);

    // Second signout with same token
    const second = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${validToken}`);
    expect([200, 401]).toContain(second.statusCode); // Depending on token invalidation logic
  });

  // ❌ Negative
  it('TC101 – ❌ No Authorization header', async () => {
    const res = await request(app).post('/api/v1/auth/signout');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('TC102 – ❌ Malformed token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', 'Bearer this.is.invalid');
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('TC103 – ❌ Expired JWT token', async () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTQ43228800LCJleHAiOjE0ODMzMDk0MDB9._7pvnkZ1Z7NOH8U7D_FUuVd7gLxPZB1kJhAUIO0eHdk';
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('TC104 – ❌ Token with invalid signature', async () => {
    const tamperedToken =
      validToken.split('.').slice(0, 2).join('.') + '.tamperedsignature';
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${tamperedToken}`);
    expect(res.statusCode).toBe(403);
  });

  // ⚠️ Edge Test Cases
  it('TC201 – JWT token with leading/trailing spaces', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer  ${validToken} `);
    expect(res.statusCode).toBe(200);
  });

  it('TC202 – JWT token with non-ASCII characters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', 'Bearer åßçdé123');
    expect(res.statusCode).toBe(403);
  });

  it('TC203 – Token signed with wrong algorithm', async () => {
    const noneAlgToken =
      'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.';
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${noneAlgToken}`);
    expect(res.statusCode).toBe(403);
  });

  it.skip('TC204 – Token already invalidated (blacklisted)', async () => {
    const blacklistedToken = validToken; // Assume it's blacklisted after previous test
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${blacklistedToken}`);
    expect(res.statusCode).toBe(401);
  });

  // 🔍 Corner Test Cases
  it('TC301 – Empty body and no auth header', async () => {
    const res = await request(app).post('/api/v1/auth/signout');
    expect(res.statusCode).toBe(401);
  });

  it('TC302 – Null token in Authorization header', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', 'Bearer null');
    expect(res.statusCode).toBe(403);
  });

  it('TC303 – Wrong auth scheme (Basic)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', 'Basic abc123');
    expect(res.statusCode).toBe(401);
  });

  it('TC304 – Oversized JWT token', async () => {
    const oversizedToken = 'a'.repeat(10240);
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', `Bearer ${oversizedToken}`);
    expect([400, 401, 403]).toContain(res.statusCode);
  });

  it('TC305 – Authorization header, but empty string', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signout')
      .set('Authorization', 'Bearer');
    expect(res.statusCode).toBe(401);
  });
});
