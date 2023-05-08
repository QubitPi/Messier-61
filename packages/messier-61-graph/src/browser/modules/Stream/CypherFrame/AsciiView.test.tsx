// Copyright 2023 Paion Data. All rights reserved.
import { render } from '@testing-library/react'
import neo4j from 'neo4j-driver'
import React from 'react'

import {
  AsciiStatusbarComponent as AsciiStatusbar,
  AsciiViewComponent as AsciiView
} from './AsciiView'

describe('AsciiViews', () => {
  describe('AsciiView', () => {
    test('displays bodyMessage if no rows', () => {
      // Given
      const sps = jest.fn()
      const result: any = {
        records: [],
        summary: {
          resultAvailableAfter: neo4j.int(5),
          resultConsumedAfter: neo4j.int(5)
        }
      }

      // When
      const { container } = render(
        <AsciiView
          setAsciiMaxColWidth={sps}
          result={result}
          maxRows={5}
          maxFieldItems={5}
        />
      )

      // Then
      expect(container).toMatchSnapshot()
    })
    test('does not display bodyMessage if rows', () => {
      // Given
      const sps = jest.fn()
      const result: any = {
        records: [{ keys: ['x'], _fields: ['y'], get: () => 'y' }],
        summary: {
          resultAvailableAfter: neo4j.int(5),
          resultConsumedAfter: neo4j.int(5)
        }
      }

      // When
      const { container } = render(
        <AsciiView
          setAsciiMaxColWidth={sps}
          result={result}
          maxRows={5}
          maxFieldItems={5}
        />
      )

      // Then
      expect(container).toMatchSnapshot()
    })
  })
  describe('AsciiStatusbar', () => {
    test('displays statusBarMessage if no rows', () => {
      // Given
      const sps = jest.fn()
      const result: any = {
        records: [],
        summary: {
          resultAvailableAfter: neo4j.int(5),
          resultConsumedAfter: neo4j.int(5)
        }
      }

      // When
      const { container } = render(
        <AsciiStatusbar
          setAsciiSetColWidth={sps}
          result={result}
          maxRows={5}
          maxFieldItems={5}
        />
      )

      // Then
      expect(container).toMatchSnapshot()
    })
    test('displays statusBarMessage if no rows', () => {
      // Given
      const sps = jest.fn()
      const result: any = {
        records: [{ keys: ['x'], _fields: ['y'], get: () => 'y' }],
        summary: {
          resultAvailableAfter: neo4j.int(5),
          resultConsumedAfter: neo4j.int(5)
        }
      }

      // When
      const { container } = render(
        <AsciiStatusbar
          setAsciiSetColWidth={sps}
          result={result}
          maxRows={5}
          maxFieldItems={5}
        />
      )

      // Then
      expect(container).toMatchSnapshot()
    })
  })
})
