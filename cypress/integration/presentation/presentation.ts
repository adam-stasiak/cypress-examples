/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
export const getIframeDocument = () => {
  return cy
    .get('[data-cy="the-frame"]')
    .its('0.contentDocument')
    .should('exist', {timeout:15000});
};

export const getIframeBody = () => {
  // get the document
  return (
    getIframeDocument()
      // automatically retries until body is loaded
      .its('body')
      .should('not.be.undefined')
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      .then(cy.wrap)
  );
};

describe('chart card view', () => {
  beforeEach(() => {
    cy.login();
  });

  it('mocking example', () => {
    cy.visit('/dashboard/list');
    cy.intercept("/api/v1/dashboard/?q=(order_column:changed_on_delta_humanized,order_direction:desc,page:0,page_size:25)",{}
    )
    cy.visit('/dashboard/list');
  });

  it('XHR response example - sorting', () => {
    cy.visit('/dashboard/list');
    // expected order from manual test
    const expectedOrder = [
      'Tabbed Dashboard',
      'Unicode Test',
      'USA Births Names',
      `World Bank\'s Data`,
    ];
    // click on header Title
    cy.intercept('/api/v1/dashboard/?q=**').as('dashboardList');
    cy.contains('Title').click();
    // wait for request and grab results
    var names: String[] = [];
    cy.wait('@dashboardList')
      .then(xhr => {
        xhr['response']['body']['result'].forEach(element => {
          names.push(element['dashboard_title']);
        });
      })
      .then(() => {
        // verify request
        expect(names.toString()).to.be.equal(expectedOrder.toString());
        // verify UI
        for (var i = 0; i < expectedOrder.length; i++) {
          cy.get(`tbody > :nth-child(${i + 1}) > :nth-child(2)`).should(
            'have.text',
            expectedOrder[i],
          );
        }
      });
  });

  //npm i cypress-plugin-snapshots -S
  it('XHR response example - snapshot', () => {
    cy.visit('/dashboard/list');
    // expected order from manual test
    const expectedOrder = [
      'Unicode Test',
      'Tabbed Dashboard',
      'USA Births Names',
      `World Bank\'s Data`,
    ];
    // click on header Title
    cy.get('[data-test="filters-search"]').type("Unicode{enter}")
    cy.intercept('/api/v1/dashboard/?q=**').as('dashboardList');
    cy.contains('Title')
      .click()
      .then(() => {
        // wait for request and grab results
        var names: String[] = [];
        cy.wait('@dashboardList').then(xhr => {
          //cy.wrap(xhr['response']['body']['result']).snapshot()
          cy.wrap(xhr['response']['body']['result']).toMatchSnapshot();
        });
      });
  });

  it('XHR response example - image snapshot', () => {
    cy.visit('/dashboard/list');
    // expected order from manual test
    const expectedOrder = [
      'Unicode Test',
      'Tabbed Dashboard',
      'USA Births Names',
      `World Bank\'s Data`,
    ];
    // click on header Title
    cy.intercept('/api/v1/dashboard/?q=**').as('dashboardList');
    cy.contains('Title').click();
    // wait for request and grab results
    cy.wait('@dashboardList').then(() => {
      cy.get('.css-auk1s1').toMatchImageSnapshot();
      for (var i = 0; i < expectedOrder.length; i++) {
        cy.get(
          `tbody > :nth-child(${i + 1}) > :nth-child(2)`,
        ).toMatchImageSnapshot();
      }
    });
  });

  it('new tab example', () => {
    cy.visit('/databaseview/list/');
    cy.get('[data-test="btn-create-database"]').click();
    cy.get('.preferred > :nth-child(1)').click();
    cy.get('.helper-bottom > a').invoke('removeAttr', 'target').click();
    cy.contains('GitHub').click();
  });

  it('iframe example', () => {
    cy.visit('localhost:3000');
    getIframeBody().within(() => {
      cy.contains('Unicode Test').should('be.visible');
    });
  });
});
