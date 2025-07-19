describe('Home Page', () => {
  it('loads the home page', () => {
    cy.visit('/');
    cy.contains('Sign In').should('exist');
  });
});
