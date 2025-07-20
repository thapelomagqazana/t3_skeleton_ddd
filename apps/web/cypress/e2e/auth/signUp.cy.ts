describe('User Sign Up – Positive Cases', () => {
  beforeEach(() => {
    cy.resetTestUser();
    cy.visit('/signup');
  });

  it('signs up successfully with valid credentials', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed up successfully!/i);
    cy.url().should('not.include', '/signup');
  });
});


describe('User Sign Up – Negative Cases', () => {
  beforeEach(() => {
    cy.resetTestUser();
    cy.visit('/signup');
  });

  it('fails with empty form submission', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('Name must be at least 2 characters');
    cy.contains('Invalid email');
    cy.contains('Password must be at least 6 characters');
  });

  it.skip('fails with invalid email', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('invalid-email'); // Invalid email
    cy.get('input[name="password"]').type('password123');

    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email', { timeout: 4000 }).should('exist');
  });


  it('fails with short password', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.contains('Password must be at least 6 characters');
  });
});

describe('User Sign Up – Edge Cases', () => {
  beforeEach(() => {
    cy.resetTestUser();
    cy.visit('/signup');
  });

  it('accepts name with exactly 2 characters', () => {
    cy.get('input[name="name"]').type('Al');
    cy.get('input[name="email"]').type('edgeuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed up successfully!/i);
  });

  it('accepts password with exactly 6 characters', () => {
    cy.get('input[name="name"]').type('Edge Case');
    cy.get('input[name="email"]').type('edgeuser2@example.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed up successfully!/i);
  });
});

describe('User Sign Up – Corner Cases', () => {
  beforeEach(() => {
    cy.resetTestUser();
    cy.visit('/signup');
  });

  it('handles extra long name gracefully', () => {
    const longName = 'A'.repeat(40);
    cy.get('input[name="name"]').type(longName);
    cy.get('input[name="email"]').type('longname@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/signed up successfully!/i);
  });

  it('blocks duplicate sign up for same email', () => {
    cy.seedTestUser(); // Create initial user

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(/email already in use/i);
  });
});


