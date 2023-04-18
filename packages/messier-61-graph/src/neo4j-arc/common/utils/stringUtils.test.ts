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
import { toKeyString, numberToUSLocale } from './stringUtils'

describe('stringUtils', () => {
  describe('toKeyString', () => {
    it('can encode strings with special characters', () => {
      // Given
      const strs = [
        { str: 'hey ho ', expect: 'aGV5JTIwaG8lMjAlRUYlQTMlQkY=' },
        {
          str: '✓ à la mode',
          expect: 'JUUyJTlDJTkzJTIwJUMzJUEwJTIwbGElMjBtb2Rl'
        },
        { str: '😍', expect: 'JUYwJTlGJTk4JThE' }
      ]

      // When & Then
      strs.forEach(str => {
        expect(toKeyString(str.str)).toEqual(str.expect)
      })
    })
  })

  describe('numberToUSLocale', () => {
    test('should return the original value if isNaN(value) is true', () => {
      // Given
      const value = null

      // When
      const returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe(value)
    })
    test('should return a non-comma separated number if isNaN(value) is false and 0 <= value < 1000', () => {
      let value, returnValue
      // Given
      value = 0

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('0')

      // Given
      value = '10'

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('10')

      // Given
      value = 999

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('999')
    })
    test('should return a thousands comma separated number if isNaN(value) is false and value >= 1000 ', () => {
      let value, returnValue
      // Given
      value = 1000

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('1,000')

      // Given
      value = '123456789'

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('123,456,789')

      // Given
      value = 987654312345

      // When
      returnValue = numberToUSLocale(value)

      // Then
      expect(returnValue).toBe('987,654,312,345')
    })
  })
})
