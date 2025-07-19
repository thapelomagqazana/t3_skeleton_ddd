/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('resetTestUser', () => {
  const emailsToDelete = [
    'testuser@example.com',
    'edgeuser@example.com',
    'edgeuser2@example.com',
    'longname@example.com',
  ];

  cy.request('POST', `${Cypress.env('apiUrl')}/test/reset-user`, {
    emails: emailsToDelete,
  });
});

type SeedTestUserOptions = {
  email?: string;
  password?: string;
  name?: string;
};

Cypress.Commands.add('seedTestUser', (options: SeedTestUserOptions = {}) => {
  const {
    email = 'testuser@example.com',
    password = 'password123',
    name = 'Test User',
  } = options;

  cy.request('POST', `${Cypress.env('apiUrl')}/auth/signup`, {
    name,
    email,
    password,
  });
});

Cypress.Commands.add('loginByUI', () => {
  cy.visit('/signin');
  cy.get('input[name="email"]').type('testuser@example.com');
  cy.get('input[name="password"]').type('password123');
  cy.get('button[type="submit"]').click();
});

