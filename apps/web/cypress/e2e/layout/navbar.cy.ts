describe('Navbar – Auth State Navigation', () => {
  context('When user is unauthenticated', () => {
    beforeEach(() => {
      cy.resetTestUser(); // ensure user is deleted
      cy.clearLocalStorage(); // ensure logged out
      cy.visit('/');
    });

    it('shows app name and guest links', () => {
      cy.contains(Cypress.env('APP_NAME') || 'T3 Skeleton Frontend'); // fallback
      cy.get('nav').within(() => {
        cy.contains('Sign Up').should('exist').and('have.attr', 'href', '/signup');
        cy.contains('Sign In').should('exist').and('have.attr', 'href', '/signin');
        cy.contains('Dashboard').should('not.exist');
        cy.contains('Sign Out').should('not.exist');
      });
    });
  });

  context('When user is authenticated', () => {
    beforeEach(() => {
      cy.resetTestUser(); // ensure user is deleted
      cy.seedTestUser(); // ensure user exists
      cy.loginByUI();    // or cy.loginByAPI() if you have it
      cy.visit('/');
    });

    it.skip('shows dashboard and sign out links, hides sign in/up', () => {
      cy.get('nav').within(() => {
        cy.contains('Dashboard').should('exist').and('have.attr', 'href', '/dashboard');
        cy.contains('Sign Out').should('exist').and('have.attr', 'href', '/signout');
        cy.contains('Sign In').should('not.exist');
        cy.contains('Sign Up').should('not.exist');
      });
    });
  });
});
