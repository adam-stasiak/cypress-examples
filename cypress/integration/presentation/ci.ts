describe('ci example', () => {
  beforeEach(() => {
  });
  
  it('iframe example', () => {
    cy.visit('localhost:3000');
    cy.contains("XHR in iframe")
    cy.screenshot()
  });
});
