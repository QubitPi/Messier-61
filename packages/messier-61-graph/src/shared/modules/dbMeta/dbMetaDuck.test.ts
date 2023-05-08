// Copyright 2023 Paion Data. All rights reserved.
import reducer, {
  CLEAR_META,
  UPDATE_META,
  UPDATE_SERVER,
  UPDATE_SETTINGS
} from './dbMetaDuck'
import { APP_START } from 'shared/modules/app/appDuck'

describe('hydrating state', () => {
  test('should merge inital state and state on load', () => {
    // Given
    const action = { type: APP_START }

    // When
    const hydratedState = reducer({ foo: 'bar' } as any, action)

    // Then
    expect(hydratedState).toMatchSnapshot()
  })

  test('can update server settings', () => {
    // Given
    const initState: any = {
      shouldKeep: true
    }
    const action = {
      type: UPDATE_SETTINGS,
      settings: {
        'browser.test': 1
      }
    }

    // When
    const nextState = reducer(initState, action)

    // Then
    expect(nextState).toMatchSnapshot()
  })

  test('can update server info', () => {
    // Given
    const initState: any = {
      shouldKeep: true
    }
    const action = {
      type: UPDATE_SERVER,
      version: '3.2.0-RC2',
      edition: 'enterprise',
      storeId: 'xxxx'
    }

    // When
    const nextState = reducer(initState, action)

    // Then
    expect(nextState).toMatchSnapshot()
  })

  test('can CLEAR to reset state', () => {
    // Given
    const initState: any = {
      shouldKeep: false,
      server: {
        edition: 'enterprise',
        storeId: 'xxxx',
        version: '3.2.0-RC2'
      }
    }
    const action = {
      type: CLEAR_META
    }

    // When
    const nextState = reducer(initState, action)

    // Then
    expect(nextState).toMatchSnapshot()
  })

  test('can update meta values with UPDATE', () => {
    // Given
    const initState: any = {
      myKey: 'val',
      noKey: true
    }
    const action = { type: UPDATE_META, myKey: 'yo', secondKey: true }

    // When
    const nextState = reducer(initState, action)

    // Then
    expect(nextState).toMatchSnapshot()
  })
})
