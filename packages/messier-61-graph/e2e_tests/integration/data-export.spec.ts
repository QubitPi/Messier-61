/*
 * Copyright Jiaqi Liu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global Cypress, cy, before */

describe('Data export', () => {
  before(function () {
    cy.visit(Cypress.config('url')).title().should('include', 'Neo4j Browser')
    cy.wait(3000)
  })
  it('can connect', () => {
    const password = Cypress.config('password')
    cy.connect('neo4j', password)
  })
  context('export options', () => {
    before(function () {
      cy.executeCommand(':clear')
      cy.executeCommand('PROFILE CREATE (n:ExportTest) RETURN n')
      cy.get('[data-testid="frame"]', { timeout: 10000 }).should(
        'have.length',
        1
      )
    })
    after(function () {
      cy.executeCommand('MATCH (n:ExportTest) DETACH DELETE n')
    })
    const tests = [
      { panel: 'Visualization', expected: ['PNG', 'SVG'] },
      {
        panel: 'Plan',
        expected: [
          ...(Cypress.config('serverVersion') >= 5.0 ? ['TXT'] : []),
          'PNG',
          'SVG'
        ]
      },
      { panel: 'Table', expected: ['CSV', 'JSON'] },
      { panel: 'Ascii', expected: ['CSV', 'JSON'] },
      { panel: 'Code', expected: ['CSV', 'JSON'] }
    ]
    tests.forEach(({ panel, expected }) => {
      it(`shows the correct export buttons for ${panel} view`, () => {
        cy.get(`[data-testid="cypherFrameSidebar${panel}"]`, {
          timeout: 10000
        }).click()
        cy.get('[data-testid="frame-export-dropdown"]').trigger('mouseover')
        cy.get('[data-testid="frame-export-dropdown"]', {
          timeout: 10000
        }).within(() => {
          cy.get('a').then(exportButtonsList => {
            expect(exportButtonsList).to.have.length(expected.length)
            expected.forEach((exportType, index) => {
              expect(exportButtonsList.eq(index)).to.contain(
                `Export ${exportType}`
              )
            })
          })
        })
      })
    })
  })

  it('can export history', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(':history')
    cy.get('[data-testid="frame-export-dropdown"]').trigger('mouseover')
    cy.get('[data-testid="frame-export-dropdown"]', {
      timeout: 10000
    }).within(() => {
      cy.get('a').then(exportButtonsList => {
        expect(exportButtonsList).to.have.length(1)
        expect(exportButtonsList.eq(0)).to.contain('Export history')
      })
    })
  })
})
