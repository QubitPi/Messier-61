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
import { SubmitQueryButton } from '../support/commands'

const testData = [
  { title: 'handles :param without web worker', useWebWorker: false },
  { title: 'handles :param WITH web worker', useWebWorker: true }
]

testData.forEach(testData => {
  describe(testData.title, () => {
    before(function () {
      cy.visit(Cypress.config('url')).title().should('include', 'Neo4j Browser')
      cy.wait(3000)
      cy.executeCommand(
        `:config userCypherThread: ${testData.useWebWorker ? 'true' : 'false'}`
      ).then(() => {
        cy.executeCommand(':clear')
      })
    })

    it('can connect', () => {
      const password = Cypress.config('password')
      cy.connect('neo4j', password)
    })

    it(':param x => 1+1', () => {
      // Set param
      cy.executeCommand(':clear')
      const setParamQ = ':param x => 1+1'
      cy.executeCommand(setParamQ)
      cy.resultContains('"x": 2')
      // return param
      cy.executeCommand(':clear')
      const getParamQ = 'RETURN $x'
      cy.executeCommand(getParamQ)
      cy.waitForCommandResult()
      cy.resultContains('2')
    })

    it(':param x => {prop: 1} multi line', () => {
      // Set param
      cy.executeCommand(':clear')
      const setParamQ = `:param [x] => {{}{shift}{enter}RETURN {{}prop: 1} AS x`
      cy.executeCommand(setParamQ)
      cy.resultContains('"prop": 1')
      // return param
      cy.executeCommand(':clear')
      const getParamQ = 'RETURN $x'
      cy.executeCommand(getParamQ)
      cy.waitForCommandResult()
      cy.resultContains('"prop": 1')
    })

    it(':param x => 1.0', () => {
      // Set param
      cy.executeCommand(':clear')
      const setParamQ = ':param x => 1.0'
      cy.executeCommand(setParamQ)
      cy.resultContains('"x": 1.0')

      // return param
      cy.executeCommand(':clear')
      const getParamQ = 'RETURN $x'
      cy.executeCommand(getParamQ)
      cy.waitForCommandResult()
      cy.resultContains('1.0')
    })

    it('handles falsy param value e.g. :param x => 0', () => {
      // Set param
      cy.executeCommand(':clear')
      const setParamQ = ':param x => 0'
      cy.executeCommand(setParamQ)
      cy.resultContains('"x": 0')

      // return param
      cy.executeCommand(':clear')
      const getParamQ = 'RETURN $x'
      cy.executeCommand(getParamQ)
      cy.waitForCommandResult()
      cy.resultContains('0')
    })

    if (Cypress.config('serverVersion') >= 3.4) {
      it(":param x => point({crs: 'wgs-84', latitude: 57.7346, longitude: 12.9082})", () => {
        cy.executeCommand(':clear')
        const query =
          ":param x => point({crs: 'wgs-84', latitude: 57.7346, longitude: 12.9082})"
        cy.executeCommand(query, { parseSpecialCharSequences: false })

        cy.get('[data-testid="rawParamData"]', { timeout: 20000 })
          .first()
          .should('contain', '"x": point({srid:4326, x:12.9082, y:57.7346})')
        const getParamQ = 'RETURN $x'
        cy.executeCommand(getParamQ)
        cy.waitForCommandResult()
        cy.resultContains('point({srid:4326, x:12.9082, y:57.7346})')
      })
    }

    // :params
    it('can set :params with multiple lines syntax', () => {
      cy.executeCommand(':clear')
      const setParamQ = `:params {{} x: 1,{shift}{enter}stringWithSpace:'with space',{shift}{enter}stringWithTab: 'with\ttab'{}}`
      cy.executeCommand(setParamQ)
      cy.get('[data-testid="rawParamData"]', { timeout: 20000 })
        .first()
        .should(
          'contain',
          '{\n  "x": 1.0,\n  "stringWithSpace": "with space",\n  "stringWithTab": "\'with\ttab\'"\n}'
        )
      const getParamQ = 'RETURN $stringWithSpace'
      cy.executeCommand(getParamQ)
      cy.waitForCommandResult()
      cy.resultContains('"with space"')
    })

    it('can set :params where a new line is before the {', () => {
      cy.executeCommand(':clear')
      const setParamQ = `:params{shift}{enter}{{} x: 1,{shift}{enter}stringWithSpace:'with space',{shift}{enter}stringWithTab: 'with\ttab'{}}`
      cy.executeCommand(setParamQ)
      cy.get('[data-testid="rawParamData"]', { timeout: 20000 })
        .first()
        .should(
          'contain',
          '{\n  "x": 1.0,\n  "stringWithSpace": "with space",\n  "stringWithTab": "\'with\ttab\'"\n}'
        )
    })

    it('can generate a set params template to use if query is missing params', () => {
      cy.executeCommand(':clear')
      cy.executeCommand('return $test1, $test2')
      const expectedMessage = `Expected parameter(s): test1, test2`
      cy.get('[data-testid="cypherFrameErrorMessage"]', { timeout: 20000 })
        .first()
        .should('contain', expectedMessage)

      // press generate template button
      cy.get(
        `[aria-label="Set editor content with template to be used for setting the missing parameters"]`
      ).click()

      const expectedCommand = ':params'
      cy.getEditor().contains(expectedCommand)

      cy.get(SubmitQueryButton).click()

      const expectedParamsData = `{
  "test1": "fill_in_your_value",
  "test2": "fill_in_your_value",
  "x": 1.0,
  "stringWithSpace": "with space",
  "stringWithTab": "\\"'with\ttab'\\""
}`
      cy.get('[data-testid="rawParamData"]')
        .first()
        .should('contain', expectedParamsData)

      cy.executeCommand(':clear')
    })
  })
})
