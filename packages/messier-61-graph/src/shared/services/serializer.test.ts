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
import { CSVSerializer } from './serializer'

describe('resultTransform', () => {
  describe('CSV', () => {
    test('should serialize array to CSV', () => {
      const cols = ['col1', 'col2']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('col1,col2')
    })
    test('should escape quote with double quote in columns', () => {
      const cols = ['col1', '"col2"']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('col1,"""col2"""')
    })
    test("should throw exception when row doesn't match columns", () => {
      const cols = ['col1', '"col2"']
      const s = CSVSerializer(cols)
      expect(() => s.append(['x'])).toThrowError('Column number mismatch')
    })
    test('should throw exception when row is empty in multi column env', () => {
      const cols = ['col1', '"col2"']
      const s = CSVSerializer(cols)
      expect(() => s.append()).toThrowError('Column number mismatch')
    })
    test('should not throw exception when row is empty in one column env', () => {
      const cols = ['col1']
      const s = CSVSerializer(cols)
      expect(() => s.append(null)).not.toThrow()
    })
    test('should insert a line break for each row', () => {
      const cols = ['col1', '"col2"']
      const data = ['data1', 'data2']
      const s = CSVSerializer(cols)
      s.append(data)
      expect(s.output().split('\n').length).toEqual(2)
    })
    test('should take many rows at once with appendRows', () => {
      const cols = ['col1', '"col2"']
      const data = [
        ['data1', 'data2'],
        ['data3', 'data4']
      ]
      const s = CSVSerializer(cols)
      s.appendRows(data)
      expect(s.output().split('\n').length).toEqual(3)
    })
    test('should escape delimiter characters in data', () => {
      const cols = ['column, first', 'column, second']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('"column, first","column, second"')
    })
    test('should both escape and quote data', () => {
      const cols = ['column, "first"', 'column, "second"']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('"column, ""first""","column, ""second"""')
    })
    test('should not strip whitespace in data', () => {
      const cols = [' column', ' column2 ']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual(' column, column2 ')
    })
    test('should represent null values as null', () => {
      const cols = [null, 'col']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual(',col')
    })
    test('should represent empty values as ""', () => {
      const cols = ['', 'col']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('"",col')
    })
    test('should represent boolean values as "true" and "false"', () => {
      const cols = [true, false]
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('true,false')
    })
    test('should represent Object values as JSON', () => {
      const cols = [{ name: 'John' }]
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual('"{""name"":""John""}"')
    })
    test('should escape newlines in values properly ', () => {
      const cols = ['a\nb', 'b\nc']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual(
        `"a
b","b
c"`
      )
    })
    test('should escape newlines in values properly even with \r', () => {
      const cols = ['a\r\nb', 'b\r\nc']
      const s = CSVSerializer(cols)
      expect(s.output()).toEqual(`"a\r\nb","b\r\nc"`)
    })
  })
})
