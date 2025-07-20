describe('Protected Route – Dashboard Access', () => {
  beforeEach(() => {
    cy.resetTestUser();
    cy.seedTestUser(); // creates { email: testuser@example.com, password: password123 }
  });

  it('redirects unauthenticated user to /signin when visiting /dashboard', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/signin');
    cy.contains(/sign in/i);
  });

  it('allows access to /dashboard after successful login', () => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains(/welcome back/i);
    cy.contains(/Profile/i);
    cy.contains(/Quick Actions/i);
    cy.contains(/Recent Activity/i);
  });

  it('blocks access to /dashboard with fake token in localStorage', () => {
    window.localStorage.setItem(
      'auth',
      JSON.stringify({
        token: 'fake.invalid.jwt',
        user: {
          name: 'Hacker',
          email: 'hacker@exploit.com',
        },
      })
    );

    cy.visit('/dashboard');
    cy.url().should('include', '/signin');
    cy.contains(/sign in/i);
  });

  it.skip('shows personalized greeting with user name after login', () => {
    cy.loginByUI();
    cy.visit('/dashboard');

    cy.contains(/^Welcome back.*👋$/i); // Robust match
  });

  it('persists dashboard access across reloads if token is valid', () => {
    cy.loginByUI();
    cy.reload();
    cy.visit('/dashboard');

    cy.url().should('include', '/dashboard');
    
  });
});
