// Copyright 2023 Paion Data. All rights reserved.
import { paginationHelper } from './Pagination'

const D = '...'
describe('Pagination', () => {
  test('paginationHelper', () => {
    // doesn't crash on out of bounds
    expect(paginationHelper(0, 1)).toEqual([])

    // Handles simple cases
    expect(paginationHelper(0, 0)).toEqual([])
    expect(paginationHelper(3, 0)).toEqual([0, 1, 2])
    expect(paginationHelper(6, 4)).toEqual([0, 1, 2, 3, 4, 5])

    // Same for list of 7 regardless of selection
    Array.from({ length: 7 }).forEach((_a, i) => {
      expect(paginationHelper(7, i)).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    // Handles all cases length 8
    expect(paginationHelper(8, 0)).toEqual([0, 1, 2, 3, 4, D, 7])
    expect(paginationHelper(8, 1)).toEqual([0, 1, 2, 3, 4, D, 7])
    expect(paginationHelper(8, 2)).toEqual([0, 1, 2, 3, 4, D, 7])
    expect(paginationHelper(8, 3)).toEqual([0, 1, 2, 3, 4, D, 7])
    expect(paginationHelper(8, 4)).toEqual([0, D, 3, 4, 5, 6, 7])
    expect(paginationHelper(8, 5)).toEqual([0, D, 3, 4, 5, 6, 7])
    expect(paginationHelper(8, 6)).toEqual([0, D, 3, 4, 5, 6, 7])
    expect(paginationHelper(8, 7)).toEqual([0, D, 3, 4, 5, 6, 7])

    // Handles all cases length 9
    expect(paginationHelper(9, 0)).toEqual([0, 1, 2, 3, 4, D, 8])
    expect(paginationHelper(9, 1)).toEqual([0, 1, 2, 3, 4, D, 8])
    expect(paginationHelper(9, 2)).toEqual([0, 1, 2, 3, 4, D, 8])
    expect(paginationHelper(9, 3)).toEqual([0, 1, 2, 3, 4, D, 8])
    expect(paginationHelper(9, 4)).toEqual([0, D, 3, 4, 5, D, 8])
    expect(paginationHelper(9, 5)).toEqual([0, D, 4, 5, 6, 7, 8])
    expect(paginationHelper(9, 6)).toEqual([0, D, 4, 5, 6, 7, 8])
    expect(paginationHelper(9, 7)).toEqual([0, D, 4, 5, 6, 7, 8])
    expect(paginationHelper(9, 8)).toEqual([0, D, 4, 5, 6, 7, 8])
  })
})
