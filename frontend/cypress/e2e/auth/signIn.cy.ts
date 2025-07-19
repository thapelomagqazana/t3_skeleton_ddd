describe('User Sign In Flow', () => {
  before(() => {
    cy.resetTestUser();     // Delete if exists
    cy.seedTestUser();      // Create valid test user
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/'); // Optional: force reload app
  });

  // Positive Test Case
  it('signs in successfully with valid credentials', () => {
    cy.visit('/signin');

    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed in successfully/i);
    cy.url().should('not.include', '/signin');
    cy.url().should('include', '/dashboard');
    cy.window().its('localStorage.token').should('exist');
  });

  // Negative Test Cases
  it('fails with empty form submission', () => {
    cy.visit('/signin');
    cy.get('button[type="submit"]').click();

    cy.contains(/email/i);
    cy.contains(/password/i);
  });

  it('fails with wrong email', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid credentials/i);
    cy.url().should('include', '/signin');
  });

  it('fails with wrong password', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid credentials/i);
    cy.url().should('include', '/signin');
  });

  it.skip('fails with invalid email format', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('not-an-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid email/i);
  });

  // Edge Cases
  it('signs in with email in uppercase', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('TESTUSER@EXAMPLE.COM');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed in successfully/i);
    cy.url().should('include', '/dashboard');
  });

  it('signs in with password of minimum length (6)', () => {
    // You must seed user with this password to match
    cy.resetTestUser();
    cy.seedTestUser({ password: '123456' });

    cy.visit('/signin');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed in successfully/i);
    cy.url().should('include', '/dashboard');
  });

  // Corner Cases
  it.skip('handles email with leading/trailing spaces', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('  testuser@example.com  ');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed in successfully/i);
    cy.url().should('include', '/dashboard');
  });

  it('handles password with leading/trailing spaces (should fail)', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('  password123  ');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid credentials/i);
  });
});
