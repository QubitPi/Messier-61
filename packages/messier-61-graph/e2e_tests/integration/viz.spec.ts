// Copyright 2023 Paion Data. All rights reserved.

/* global Cypress, cy, before */

const GREY = 'rgb(165, 171, 182)' // Default color for nodes and relationships
const ORANGE = 'rgb(247, 151, 103)'
const PURPLE = 'rgb(201, 144, 192)' // Default first color for a new node label

describe('Viz rendering', () => {
  before(function () {
    cy.visit(Cypress.config('url')).title().should('include', 'Neo4j Browser')
    cy.wait(3000)
    cy.ensureConnection()
  })

  it('shows legend with rel types + node labels on first render', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )
    cy.get('[data-testid="vizInspector"]', { timeout: 5000 }).contains(
      'CONNECTS'
    )
    cy.get('[data-testid="vizInspector"]', { timeout: 5000 }).contains(
      'TestLabel'
    )
    cy.executeCommand('MATCH (a:TestLabel) DETACH DELETE a')
  })
  it('can change default color of nodes', () => {
    const selectorNodeLabelAll =
      '[data-testid="property-details-overview-node-label-*"]'
    cy.executeCommand(':clear')
    cy.executeCommand(':style reset')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )
    // Check that default color is set
    cy.get(selectorNodeLabelAll, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      GREY
    )

    // Change color and make sure color is changed
    cy.get(selectorNodeLabelAll, { timeout: 5000 }).click()
    cy.get('[data-testid="select-color-2"]').click()
    cy.get('[data-testid="cypherFrameSidebarVisualization"]').click() // Close grass editor

    cy.get(selectorNodeLabelAll, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      ORANGE
    )
  })
  it('can change default color of relationships', () => {
    const selectorRelationshipsAll = `[data-testid="property-details-overview-relationship-type-*"]`

    cy.executeCommand(':clear')
    cy.executeCommand(':style reset')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )
    // Check that default color is set
    cy.get(selectorRelationshipsAll, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      GREY
    )

    // Change color and make sure color is changed
    cy.get(selectorRelationshipsAll, { timeout: 5000 }).click()
    cy.get('[data-testid="select-color-2"]').click()
    cy.get('[data-testid="cypherFrameSidebarVisualization"]').click() // Close grass editor

    cy.get(selectorRelationshipsAll, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      ORANGE
    )
  })
  it('can change styling of nodes with certain label', () => {
    const selectorNodeLabel =
      '[data-testid="property-details-overview-node-label-TestLabel"]'
    cy.executeCommand(':clear')
    cy.executeCommand(':style reset')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )
    // Check that default color is set
    cy.get(selectorNodeLabel, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      PURPLE
    )

    // Change color and make sure color is changed
    cy.get(selectorNodeLabel, { timeout: 5000 }).click()
    cy.get('[data-testid="select-color-2"]').click()
    cy.get('[data-testid="cypherFrameSidebarVisualization"]').click() // Close grass editor

    cy.get(selectorNodeLabel, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      ORANGE
    )
  })
  it('can change styling of relationship of certain type', () => {
    const selectorRelationshipType =
      '[data-testid="property-details-overview-relationship-type-CONNECTS"]'
    cy.executeCommand(':clear')
    cy.executeCommand(':style reset')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )
    // Check that default color is set
    cy.get(selectorRelationshipType, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      GREY
    )

    // Change color and make sure color is changed
    cy.get(selectorRelationshipType, { timeout: 5000 }).click()
    cy.get('[data-testid="select-color-2"]').click()
    cy.get('[data-testid="cypherFrameSidebarVisualization"]').click() // Close grass editor

    cy.get(selectorRelationshipType, { timeout: 5000 }).should(
      'have.css',
      'background-color',
      ORANGE
    )
  })
  it('can zoom in with button', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(`CREATE (a:TestLabel {name: 'testNode'}) RETURN a`, {
      parseSpecialCharSequences: false
    })

    const zoomOutButton = cy.get(`[aria-label="zoom-out"]`)
    zoomOutButton.click({ force: true })
    zoomOutButton.wait(3000)

    // Check that zoom in button increases the size of the node in the graph view
    cy.get('svg')
      .find(`[aria-label^="graph-node"]`)
      .then($el => $el[0].getBoundingClientRect().width)
      .then(width => {
        const originalWidth = width
        expect(originalWidth).to.be.greaterThan(0)

        const zoomInButton = cy.get(`[aria-label="zoom-in"]`)
        zoomInButton.click()

        cy.get('svg')
          .find(`[aria-label^="graph-node"]`)
          .then($el => $el[0].getBoundingClientRect().width)
          .then(newWidth => {
            return expect(newWidth).to.be.greaterThan(originalWidth)
          })
      })
  })
  it('disables zoom in button after limit is reached', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(`CREATE (a:TestLabel {name: 'testNode'}) RETURN a`, {
      parseSpecialCharSequences: false
    })

    // Multiple zoom will result in zoom reaching scale limit and the button to be disabled
    const zoomInButton = cy.get(`[aria-label="zoom-in"]`)
    zoomInButton.click({ force: true })
    zoomInButton.click({ force: true })
    zoomInButton.click({ force: true })
    zoomInButton.click({ force: true })
    zoomInButton.click({ force: true })

    cy.get(`[aria-label="zoom-in"]`).should('be.disabled')
  })
  it('can zoom out with just mouse wheel in fullscreen', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(`CREATE (a:TestLabel {name: 'testNode'}) RETURN a`, {
      parseSpecialCharSequences: false
    })

    // Enter fullscreen
    cy.get('article').find(`[title='Fullscreen']`).click()
    cy.get(`#svg-vis`).trigger('wheel', { deltaY: 3000 })

    cy.get(`[aria-label="zoom-out"]`).should('be.disabled')

    // Leave fullscreen
    cy.get('article').find(`[title='Close fullscreen']`).click()
  })
  it('can not zoom out with just mouse wheel when not in fullscreen', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(`CREATE (a:TestLabel {name: 'testNode'}) RETURN a`, {
      parseSpecialCharSequences: false
    })

    cy.get(`#svg-vis`).trigger('wheel', { deltaY: 3000 })

    cy.get(`[aria-label="zoom-out"]`).should('be.enabled')
  })
  it('displays wheel zoom info message which can be closed', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(
      'CREATE (a:TestLabel)-[:CONNECTS]->(b:TestLabel) RETURN a, b'
    )

    cy.get(`#svg-vis`).trigger('wheel', { deltaY: 3000 })

    cy.get('[data-testid=wheelZoomInfoCheckbox]').should('exist')

    cy.get('[data-testid=wheelZoomInfoCheckbox]').click()

    cy.get('[data-testid=wheelZoomInfoCheckbox]').should('not.exist')
  })
  it('can zoom out when holding down shift and scrolling', () => {
    cy.executeCommand(':clear')
    cy.executeCommand(`CREATE (a:TestLabel {name: 'testNode'}) RETURN a`, {
      parseSpecialCharSequences: false
    })

    cy.get('#svg-vis').trigger('wheel', { deltaY: 3000, shiftKey: true })
    cy.get(`[aria-label="zoom-out"]`).should('be.disabled')
  })
  it('can handle lots of property values and labels in node properties panel', () => {
    const numberOfProps = 50
    const numberOfLabels = 50
    const queryLabels = Array.from({ length: numberOfLabels }, (x, i) => {
      return `:label${i}`
    }).join(' ')
    const queryProps = Array.from({ length: numberOfProps }, (x, i) => {
      return `prop${i}: 'hejsan'`
    }).join(', ')
    const query = `CREATE (nodeWithLotsOfProps ${queryLabels} { ${queryProps} }) RETURN nodeWithLotsOfProps`
    cy.executeCommand(':clear')

    // Directly set text to avoid waiting for ever when typing all chars
    const editorTextarea = '#monaco-main-editor textarea'
    cy.get(editorTextarea).click()
    cy.get(editorTextarea).focus()
    cy.get(editorTextarea)
      .then(elem => {
        elem.val(query)
      })
      .type(' {ENTER}')

    // Scroll to bottom after labels loaded
    const lastLabel = `label${numberOfLabels - 1}`
    cy.get('[data-testid="vizInspector"]', { timeout: 5000 })
      .contains(lastLabel)
      .scrollIntoView()
      .should('be.visible')

    const showAllButtonText = 'Show all'
    cy.get(`button:contains("${showAllButtonText}")`)
      .scrollIntoView()
      .should('be.visible')

    // Open node properties details panel
    const nodeSelector = '.node'
    cy.get(nodeSelector).click()

    const selectorPropsTable =
      '[data-testid="viz-details-pane-properties-table"]'
    cy.get(selectorPropsTable).should('be.visible')

    const lastPropName = 'prop9'
    cy.contains(lastPropName).should('exist')

    // For some reason need to get to the td to be able to scroll to it, hence the parent()
    cy.get('[data-testid="viz-details-pane-body"]').scrollTo('bottom')
    cy.get('tr td span').contains(lastPropName).should('be.visible')
  })
})
