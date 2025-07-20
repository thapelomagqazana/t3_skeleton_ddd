import request from 'supertest';
import app from '../../src/app';
import { clearTestUsers, seedUser } from '../helpers/db.helper';
import { signinValid, signinInvalid, signinEdge, signinCorner } from '../helpers/user.helper';
import prisma from '../../src/db';

describe('POST /api/v1/auth/signin', () => {
  beforeEach(async () => {
    await clearTestUsers();
    await seedUser(); // Seed: john@example.com / secret123
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('TC001 – ✅ Valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinValid.TC001);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(signinValid.TC001.email.toLowerCase());
  });

  it('TC002 – ✅ Email with uppercase letters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinValid.TC002);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(signinValid.TC002.email.toLowerCase());
  });

  it('TC101 – ❌ Missing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinInvalid.TC101);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('TC102 – ❌ Missing password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinInvalid.TC102);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveProperty('password');
  });

  it('TC103 – ❌ Invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinInvalid.TC103);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('TC104 – ❌ Incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinInvalid.TC104);
    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toMatch(/invalid credentials/i);
  });

  it('TC105 – ❌ Nonexistent user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send(signinInvalid.TC105);
    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toMatch(/invalid credentials/i);
  });

  // ⚠️ Edge
  it('TC201 – ⚠️ Password with leading/trailing spaces', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinEdge.TC201);
    expect(res.statusCode).toBe(401); // Depends on backend trim config
  });

  it('TC202 – ⚠️ Email with leading/trailing spaces', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinEdge.TC202);
    expect(res.statusCode).toBe(200); // If backend trims and normalizes
  });

  it('TC203 – ⚠️ Very long password', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinEdge.TC203);
    expect([400, 401]).toContain(res.statusCode);
  });

  it('TC204 – ⚠️ Password with special characters', async () => {
    // Assumes password is correct and seeded user has this password
    const res = await request(app).post('/api/v1/auth/signin').send(signinEdge.TC204);
    expect([200, 401]).toContain(res.statusCode); // If backend supports this format
  });

  // 🔍 Corner
  it('TC301 – 🔍 Empty object', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinCorner.TC301);
    expect(res.statusCode).toBe(400);
  });

  it('TC302 – 🔍 Null fields', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinCorner.TC302);
    expect(res.statusCode).toBe(400);
  });

  it('TC303 – 🔍 Extra field in body', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinCorner.TC303);
    expect([200, 400]).toContain(res.statusCode);
  });

  it('TC304 – 🔍 SQL injection in email', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinCorner.TC304);
    expect(res.statusCode).toBe(400);
  });

  it('TC305 – 🔍 JavaScript injection in password', async () => {
    const res = await request(app).post('/api/v1/auth/signin').send(signinCorner.TC305);
    expect([400, 401]).toContain(res.statusCode);
  });
});
