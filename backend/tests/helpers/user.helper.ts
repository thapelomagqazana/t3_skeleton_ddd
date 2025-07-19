export const validUsers = {
  TC001: { name: 'John Doe', email: 'john@example.com', password: 'secret123' },
  TC002: { name: 'Jane', email: 'JANE@EXAMPLE.COM', password: 'pass1234' },
};

export const invalidUsers = {
  TC101: { email: 'test@example.com', password: 'secret123' },
  TC102: { name: 'Test User', password: 'secret123' },
  TC103: { name: 'Test User', email: 'test@example.com' },
  TC104: { name: 'Test', email: 'notanemail', password: 'secret123' },
  TC105: { name: 'Test', email: 'short@example.com', password: 'abc' },
  TC106: { name: 'Test', email: 'existing@example.com', password: 'secret123' },
  TC107: { name: 'Test', email: 'test@example.com', password: 'secret123', role: 'admin' },
};

export const edgeUsers = {
  TC201: { name: "A", email: "a@example.com", password: "secret123" },
  TC202: { name: "Edge", email: "edge@example.com", password: "123456" },
  TC203: { name: "Special", email: "spe@cial.com", password: "P@ssw0rd!" },
  TC204: { name: " Trim ", email: " trim@example.com ", password: "pass1234" },
};

export const cornerUsers = {
  TC301: { name: "", email: "", password: "" },
  TC302: { name: null, email: null, password: null },
  TC303: { name: "A".repeat(40), email: "long@example.com", password: "secret123" },
  TC304: { name: "Hacker", email: "' OR 1=1--", password: "hackpass" },
  TC305: { name: "<script>alert(1)</script>", email: "safe@example.com", password: "secure123" },
};

export const signinValid = {
  TC001: {
    email: 'existing@example.com',
    password: 'secret123',
  },
  TC002: {
    email: 'existing@example.com'.toUpperCase(),
    password: 'secret123',
  },
};

export const signinInvalid = {
  TC101: {
    password: 'secret123', // missing email
  },
  TC102: {
    email: 'john@example.com', // missing password
  },
  TC103: {
    email: 'not-an-email',
    password: 'secret123',
  },
  TC104: {
    email: 'john@example.com',
    password: 'wrongpass',
  },
  TC105: {
    email: 'ghost@example.com',
    password: 'pass1234',
  },
};

export const signinEdge = {
  TC201: {
    email: 'john@example.com',
    password: ' secret123 ',
  },
  TC202: {
    email: ' existing@example.com ',
    password: 'secret123',
  },
  TC203: {
    email: 'john@example.com',
    password: 'a'.repeat(256),
  },
  TC204: {
    email: 'john@example.com',
    password: 'P@ssw0rd!#', // Must match seed if used
  },
};

export const signinCorner = {
  TC301: {},
  TC302: {
    email: null,
    password: null,
  },
  TC303: {
    email: 'existing@example.com',
    password: 'secret123',
    role: 'admin',
  },
  TC304: {
    email: "' OR 1=1--",
    password: 'anything',
  },
  TC305: {
    email: 'john@example.com',
    password: '<script>',
  },
};


