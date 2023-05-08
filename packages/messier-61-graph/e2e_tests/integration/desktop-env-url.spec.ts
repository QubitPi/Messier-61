// Copyright 2023 Paion Data. All rights reserved.

/* global Cypress, cy, before */

import { isAura, getDesktopContext } from '../support/utils'
let appContextListener: any
let appOnAgumentsChange: any

// This file only esists to be able to test the auto connect using
// the host field.
// We can't load two times in the same file

describe('Neo4j Desktop environment using url field', () => {
  before(() => {
    cy.visit(Cypress.config('url'), {
      onBeforeLoad: win => {
        win.neo4jDesktopApi = {
          getContext: () =>
            Promise.resolve(getDesktopContext(Cypress.config, 'url')),
          onContextUpdate: (fn: any) => (appContextListener = fn.bind(fn)),
          onArgumentsChange: (fn: any) => (appOnAgumentsChange = fn.bind(fn))
        }
      }
    })
  })
  // No need to run these when in Aura
  if (!isAura()) {
    it('can auto connect using url field', () => {
      const frames = cy.get('[data-testid="frameCommand"]', { timeout: 10000 })
      frames.should('have.length', 2)

      // Auto connected = :play start
      frames.first().contains(':play start')
      cy.wait(1000)
    })
    it('switches connection when that event is triggered using url field', () => {
      cy.executeCommand(':clear')
      cy.wait(1000).then(() => {
        appContextListener(
          { type: 'GRAPH_ACTIVE', id: 'test' },
          getDesktopContext(Cypress.config, 'url')
        )
      })

      const frames = cy.get('[data-testid="frameCommand"]', { timeout: 10000 })
      frames.should('have.length', 1)

      frames.first().contains(':server switch success')

      cy.get('[data-testid="frame"]', { timeout: 10000 })
        .first()
        .should('contain', 'Connection updated')
    })
    it('reacts to arguments changing and handle different encodings', () => {
      // Use regular expression to match multiple lines
      const expectedCommand = /RETURN 1;[^R]*RETURN 2;/
      cy.executeCommand(':clear')

      cy.wait(1000).then(() => {
        appOnAgumentsChange('cmd=edit&arg=RETURN+1;&arg=RETURN%202;')
      })

      cy.getEditor().contains(expectedCommand)
    })
  }
})
