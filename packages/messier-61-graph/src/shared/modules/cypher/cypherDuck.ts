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
import neo4j from 'neo4j-driver'
import Rx from 'rxjs'

import {
  getRawVersion,
  serverInfoQuery,
  SYSTEM_DB,
  updateServerInfo
} from '../dbMeta/dbMetaDuck'
import {
  FIRST_MULTI_DB_SUPPORT,
  FIRST_NO_MULTI_DB_SUPPORT,
  changeUserPasswordQuery
} from '../features/versionedFeatures'
import { getClusterAddresses } from './queriesProcedureHelper'
import bolt from 'services/bolt/bolt'
import { buildTxFunctionByMode } from 'services/bolt/boltHelpers'
import {
  getUserTxMetadata,
  userActionTxMetadata
} from 'services/bolt/txMetadata'
import { flatten } from 'services/utils'
import {
  Connection,
  getActiveConnectionData
} from 'shared/modules/connections/connectionsDuck'

const NAME = 'cypher'
export const CYPHER_REQUEST = `${NAME}/REQUEST`
export const ROUTED_CYPHER_WRITE_REQUEST = `${NAME}/ROUTED_WRITE_REQUEST`
export const AD_HOC_CYPHER_REQUEST = `${NAME}/AD_HOC_REQUEST`
export const CLUSTER_CYPHER_REQUEST = `${NAME}/CLUSTER_REQUEST`
export const FORCE_CHANGE_PASSWORD = `${NAME}/FORCE_CHANGE_PASSWORD`

// Helpers
const queryAndResolve = async (
  driver: any,
  action: any,
  host: any,
  metadata: { type: string; app: string },
  useDb = {}
) => {
  return new Promise(resolve => {
    const session = driver.session({
      defaultAccessMode: neo4j.session.WRITE,
      ...useDb
    })
    const txFn = buildTxFunctionByMode(session)
    txFn &&
      txFn((tx: any) => tx.run(action.query, action.parameters), { metadata })
        .then((r: any) => {
          session.close()
          resolve({
            type: action.$$responseChannel,
            success: true,
            result: {
              ...r,
              meta: action.host
            }
          })
        })
        .catch((e: any) => {
          session.close()
          resolve({
            type: action.$$responseChannel,
            success: false,
            error: e,
            host
          })
        })
  })
}
const callClusterMember = async (connection: any, action: any) => {
  return new Promise(resolve => {
    bolt
      .directConnect(connection, undefined, undefined, false) // Ignore validation errors
      .then(async driver => {
        const res = await queryAndResolve(
          driver,
          action,
          connection.host,
          userActionTxMetadata.txMetadata
        )
        driver.close()
        resolve(res)
      })
      .catch(error => {
        resolve({
          type: action.$$responseChannel,
          success: false,
          host: connection.host,
          error
        })
      })
  })
}

// Epics
export const cypherRequestEpic = (some$: any) =>
  some$.ofType(CYPHER_REQUEST).mergeMap((action: any) => {
    if (!action.$$responseChannel) return Rx.Observable.of(null)
    return bolt
      .directTransaction(action.query, action.params || undefined, {
        ...getUserTxMetadata(action.queryType),
        useDb: action.useDb
      })
      .then((r: any) => ({
        type: action.$$responseChannel,
        success: true,
        result: r
      }))
      .catch((e: any) => ({
        type: action.$$responseChannel,
        success: false,
        error: e
      }))
  })

export const routedCypherRequestEpic = (some$: any) =>
  some$.ofType(ROUTED_CYPHER_WRITE_REQUEST).mergeMap((action: any) => {
    if (!action.$$responseChannel) return Rx.Observable.of(null)

    const [_id, promise] = bolt.routedWriteTransaction(
      action.query,
      action.params,
      {
        ...getUserTxMetadata(action.queryType || null),
        cancelable: true,
        useDb: action.useDb
      }
    )
    return promise
      .then((result: any) => ({
        type: action.$$responseChannel,
        success: true,
        result
      }))
      .catch((error: any) => ({
        type: action.$$responseChannel,
        success: false,
        error
      }))
  })

export const adHocCypherRequestEpic = (some$: any, store: any) =>
  some$.ofType(AD_HOC_CYPHER_REQUEST).mergeMap((action: any) => {
    const connection = getActiveConnectionData(store.getState())
    const tempConnection = {
      ...connection,
      host: action.host
    }
    return callClusterMember(tempConnection, action)
  })

export const clusterCypherRequestEpic = (some$: any, store: any) =>
  some$
    .ofType(CLUSTER_CYPHER_REQUEST)
    .mergeMap((action: any) => {
      if (!action.$$responseChannel) return Rx.Observable.of(null)
      return bolt
        .directTransaction(getClusterAddresses, {}, userActionTxMetadata)
        .then((res: any) => {
          const addresses = flatten(
            res.records.map((record: any) => record.get('addresses'))
          ).filter((address: any) => address.startsWith('bolt://'))
          return {
            action,
            observables: addresses.map((host: any) => {
              const connection = getActiveConnectionData(store.getState())
              const tempConnection = {
                ...connection,
                host
              }
              return Rx.Observable.fromPromise(
                callClusterMember(tempConnection, action)
              )
            })
          }
        })
        .catch((error: any) => {
          return Rx.Observable.of({ action, error })
        })
    })
    .flatMap(({ action, observables, value }: any) => {
      if (value) return Rx.Observable.of(value)
      observables.push(Rx.Observable.of(action))
      return Rx.Observable.forkJoin(...observables)
    })
    .map((value: any) => {
      if (value && value.error) {
        return {
          type: value.action.$$responseChannel,
          success: false,
          error: value.error
        }
      }
      const action = value.pop()
      const records = value.reduce(
        (acc: any, { result, success, error, host }: any) => {
          if (!success) {
            return [
              {
                error: {
                  host,
                  message: error.message,
                  code: error.code
                }
              }
            ]
          }
          const mappedRes = result.records.map((record: any) => ({
            ...record,
            host: result.summary.server.address
          }))
          return [...acc, ...mappedRes]
        },
        []
      )
      return {
        type: action.$$responseChannel,
        success: true,
        result: { records }
      }
    })

// We need this because this is the only case where we still
// want to execute cypher even though we get an connection error back
export const handleForcePasswordChangeEpic = (some$: any, store: any) =>
  some$
    .ofType(FORCE_CHANGE_PASSWORD)
    .mergeMap(
      (
        action: Connection & { $$responseChannel: string; newPassword: string }
      ) => {
        if (!action.$$responseChannel) return Rx.Observable.of(null)

        return new Promise(resolve => {
          bolt
            .directConnect(
              action,
              {},
              undefined,
              false // Ignore validation errors
            )
            .then(async driver => {
              // Let's establish what server version we're connected to if not in state
              if (!getRawVersion(store.getState())) {
                const versionRes: any = await queryAndResolve(
                  driver,
                  { ...action, query: serverInfoQuery, parameters: {} },
                  undefined,
                  userActionTxMetadata.txMetadata
                )

                if (versionRes.success) {
                  store.dispatch(updateServerInfo(versionRes.result))
                }
              }

              let versionForPasswordQuery = getRawVersion(store.getState())

              // if we failed to get a version by querying, do a best effort quess
              const supportsMultiDb = await driver.supportsMultiDb()
              if (!versionForPasswordQuery) {
                versionForPasswordQuery = supportsMultiDb
                  ? FIRST_MULTI_DB_SUPPORT
                  : FIRST_NO_MULTI_DB_SUPPORT
              }

              // Figure out how to change the pw on that server version
              const queryObj = changeUserPasswordQuery(
                versionForPasswordQuery,
                action.password,
                action.newPassword
              )

              // and then change the password
              const res = await queryAndResolve(
                driver,
                { ...action, ...queryObj },
                undefined,
                userActionTxMetadata.txMetadata,
                supportsMultiDb ? { database: SYSTEM_DB } : undefined
              )
              driver.close()
              resolve(res)
            })
            .catch(e =>
              resolve({
                type: action.$$responseChannel,
                success: false,
                error: e
              })
            )
        })
      }
    )
