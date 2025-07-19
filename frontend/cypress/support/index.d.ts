declare namespace Cypress {
  interface Chainable {
    resetTestUser(): Chainable<void>;
    loginByUI(): Chainable<void>;
    seedTestUser(options?: {
      email?: string;
      password?: string;
      name?: string;
    }): Chainable<void>;
  }
}
