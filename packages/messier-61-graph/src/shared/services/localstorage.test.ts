// Copyright 2023 Paion Data. All rights reserved.
import * as ls from './localstorage'
import {
  ClientSettings,
  initialClientSettings
} from '../modules/dbMeta/dbMetaDuck'
import { GlobalState } from '../globalState'

jest.mock('lodash-es/debounce', () => (fn: any) => fn)

describe('localstorage', () => {
  test('getItem return items', () => {
    // Given
    const givenKey = 'myKey' as ls.LocalStorageKey
    const givenVal = 'myVal'
    const storage = {
      getItem: (key: string) => {
        expect(key).toEqual(ls.keyPrefix + givenKey)
        return JSON.stringify(givenVal)
      }
    } as Storage
    ls.setStorage(storage)

    // When
    const response = ls.getItem(givenKey)

    // Then
    expect(response).toEqual(givenVal)
  })

  test('setItem sets items', () => {
    // Given
    const givenKey = 'myKey'
    const givenVal = 'myVal'
    const storage = {
      setItem: (key, val) => {
        expect(key).toEqual(ls.keyPrefix + givenKey)
        expect(val).toEqual(JSON.stringify(givenVal))
      }
    } as Storage
    ls.setStorage(storage)

    // When
    const response = ls.setItem(givenKey, givenVal)

    // Then
    expect(response).toBeTruthy()
  })

  test('should fetch items from storage based on key input', () => {
    // Given
    const keys = ['key1', 'key2', 'key3'] as unknown as ls.LocalStorageKey[]
    const vals = {
      key1: 'hello',
      key2: [1, 2, 3]
    }
    const storage = {
      getItem: key => {
        return JSON.stringify(
          vals[key.substring(ls.keyPrefix.length) as 'key1' | 'key2']
        )
      }
    } as Storage
    ls.applyKeys(...keys)
    ls.setStorage(storage)

    // When
    const response = ls.getAll()

    // Then
    expect(response).toEqual(vals)
  })

  it('returns "settings" with the playImplicitInitCommands flag set true', () => {
    ls.applyKeys('settings')
    ls.setStorage({
      getItem: () => JSON.stringify({})
    } as Partial<Storage> as Storage)

    expect(ls.getAll()).toEqual(
      expect.objectContaining({
        settings: { playImplicitInitCommands: true }
      })
    )
  })

  describe('localstorage redux middleware', () => {
    const createAndInvokeMiddlewareWithRetainConnectionFlag = (
      retain: boolean,
      edition = 'enterprise'
    ) => {
      const setItemMock = jest.fn()
      ls.applyKeys('connections')
      ls.setStorage({
        setItem: setItemMock
      } as Partial<Storage> as Storage)

      const metaSettings: ClientSettings = {
        ...initialClientSettings,
        retainConnectionCredentials: retain
      }
      const state = {
        connections: {
          connectionsById: { $$discovery: { password: 'secret password' } }
        },
        meta: {
          server: {
            edition
          },
          settings: metaSettings
        }
      }

      const store = {
        getState: () => state,
        dispatch: jest.fn()
      }
      const next = jest.fn(action => action)
      const action = { type: 'some action' }

      ls.createReduxMiddleware()(store)(next)(action)

      return setItemMock
    }

    it('removes passwords from connection data if browser.retain_connection_credentials is false', () => {
      const setItemMock =
        createAndInvokeMiddlewareWithRetainConnectionFlag(false)

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.connections',
        JSON.stringify({
          connectionsById: { $$discovery: { password: '' } }
        })
      )
    })

    it('retains passwords in connection data if browser.retain_connection_credentials is true', () => {
      const setItemMock =
        createAndInvokeMiddlewareWithRetainConnectionFlag(true)

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.connections',
        JSON.stringify({
          connectionsById: { $$discovery: { password: 'secret password' } }
        })
      )
    })

    const existingHistory = ['history item']

    const createAndInvokeMiddlewareWithRetainHistoryFlag = ({
      retain = false,
      edition = 'enterprise',
      version = '4.3.0'
    }: {
      retain?: boolean
      edition?: string
      version?: string
    }) => {
      const setItemMock = jest.fn()
      ls.applyKeys('history')
      ls.setStorage({
        setItem: setItemMock
      } as Partial<Storage> as Storage)

      const metaSettings: ClientSettings = {
        ...initialClientSettings,
        retainEditorHistory: retain
      }
      const state = {
        history: existingHistory,
        meta: {
          server: {
            version,
            edition
          },
          settings: metaSettings
        },
        connections: {
          connectionsById: { $$discovery: { password: 'secret password' } }
        }
      }

      const store = {
        getState: () => state,
        dispatch: jest.fn()
      }
      const next = jest.fn(action => action)
      const action = { type: 'some action' }

      ls.createReduxMiddleware()(store)(next)(action)

      return setItemMock
    }

    it('removes history from data if browser.retain_editor_history is false', () => {
      const setItemMock = createAndInvokeMiddlewareWithRetainHistoryFlag({
        retain: false
      })

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.history',
        JSON.stringify([])
      )
    })

    it('retains history from data if browser.retain_editor_history is true', () => {
      const setItemMock = createAndInvokeMiddlewareWithRetainHistoryFlag({
        retain: true
      })

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.history',
        JSON.stringify(existingHistory)
      )
    })

    it('removes history from data if browser.retain_editor_history is undefined and server version is >= 4.3.0', () => {
      const setItemMock = createAndInvokeMiddlewareWithRetainHistoryFlag({})

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.history',
        JSON.stringify([])
      )
    })

    it('retains history from data if browser.retain_editor_history is undefined and server version is < 4.3.0', () => {
      const setItemMock = createAndInvokeMiddlewareWithRetainHistoryFlag({
        version: '4.2.0'
      })

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.history',
        JSON.stringify(existingHistory)
      )
    })

    it('retains history from data if browser.retain_editor_history is undefined and server edition is not enterprise', () => {
      const setItemMock = createAndInvokeMiddlewareWithRetainHistoryFlag({
        edition: 'community'
      })

      expect(setItemMock).toHaveBeenCalledWith(
        'neo4j.history',
        JSON.stringify(existingHistory)
      )
    })
  })
})
