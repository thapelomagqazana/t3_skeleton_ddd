import request from 'supertest';
import app from '../../src/app';
import { validUsers, invalidUsers, edgeUsers, cornerUsers } from '../helpers/user.helper';
import { clearTestUsers, seedUser } from '../helpers/db.helper';
import prisma from '../../src/db';

describe('POST /api/v1/auth/signup', () => {
  beforeEach(async () => {
    await clearTestUsers();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('TC001 – ✅ Valid signup', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(validUsers.TC001);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: validUsers.TC001.name,
      email: validUsers.TC001.email.toLowerCase(),
    });
  });

  it('TC002 – ✅ Email with uppercase letters (normalized)', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(validUsers.TC002);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(validUsers.TC002.email.toLowerCase());
  });

  it('TC101 – ❌ Missing name', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC101);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors.name');
  });

  it('TC102 – ❌ Missing email', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC102);
    expect(res.statusCode).toBe(400);
  });

  it('TC103 – ❌ Missing password', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC103);
    expect(res.statusCode).toBe(400);
  });

  it('TC104 – ❌ Invalid email format', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC104);
    expect(res.statusCode).toBe(400);
  });

  it('TC105 – ❌ Password too short', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC105);
    expect(res.statusCode).toBe(400);
  });

  it('TC106 – ❌ Email already registered', async () => {
    await seedUser();
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC106);
    expect(res.statusCode).toBe(409);
    expect(res.body.error.message).toMatch(/already in use/i);
  });

  it('TC107 – ❌ Extra unknown field in request body', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(invalidUsers.TC107);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors._errors[0]).toMatch(/unrecognized/i); // If Zod is configured with `.strict()`
  });

  // 🔹 EDGE TEST CASES
  it('TC201 – ⚠️ Name with 1 character', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(edgeUsers.TC201);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toBe(edgeUsers.TC201.name);
  });

  it('TC202 – ⚠️ Password exactly at minimum length (6 chars)', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(edgeUsers.TC202);
    expect(res.statusCode).toBe(201);
  });

  it('TC203 – ⚠️ Password with special characters', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(edgeUsers.TC203);
    expect(res.statusCode).toBe(201);
  });

  it('TC204 – ⚠️ Leading/trailing spaces in email or name', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(edgeUsers.TC204);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toBe(edgeUsers.TC204.name.trim());
    expect(res.body.user.email).toBe(edgeUsers.TC204.email.trim().toLowerCase());
  });

  // 🔍 CORNER TEST CASES
  it('TC301 – 🔍 All fields are empty strings', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(cornerUsers.TC301);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('TC302 – 🔍 Null fields (type mismatch)', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(cornerUsers.TC302);
    expect(res.statusCode).toBe(400);
  });

  it('TC303 – 🔍 Very long input strings', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(cornerUsers.TC303);
    expect(res.statusCode).toBe(201); // But keep an eye on performance
  });

  it('TC304 – 🔍 SQL Injection in email', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(cornerUsers.TC304);
    expect(res.statusCode).toBe(400);
  });

  it('TC305 – 🔍 JavaScript injection in name', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send(cornerUsers.TC305);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toContain('<script>');
  });
});
