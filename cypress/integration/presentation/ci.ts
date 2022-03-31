describe('ci example', () => {
  beforeEach(() => {
    cy.login();
  });
  
  it('iframe example', () => {
    cy.visit('localhost:3000');
    cy.contains("XHR in iframe")
  });
});
