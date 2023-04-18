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
import {
  setupAutocomplete,
  initalizeCypherSupport,
  toFunction,
  toLabel,
  toProcedure,
  toRelationshipType
} from 'neo4j-arc/cypher-language-support'
import { Action } from 'redux'
import { Epic } from 'redux-observable'
import Rx from 'rxjs/Rx'

import consoleCommands from 'browser/modules/Editor/consoleCommands'
import { getUrlParamValue } from 'services/utils'
import { GlobalState } from 'shared/globalState'
import { APP_START, URL_ARGUMENTS_CHANGE } from 'shared/modules/app/appDuck'
import {
  commandSources,
  executeCommand
} from 'shared/modules/commands/commandsDuck'
import { DISABLE_IMPLICIT_INIT_COMMANDS } from 'shared/modules/settings/settingsDuck'
import { UPDATE_PARAMS } from '../params/paramsDuck'
import { isOfType } from 'shared/utils/typeSafeActions'
import { DB_META_DONE } from '../dbMeta/dbMetaDuck'

export const SET_CONTENT = 'editor/SET_CONTENT'
export const EDIT_CONTENT = 'editor/EDIT_CONTENT'
export const FOCUS = 'editor/FOCUS'
export const EXPAND = 'editor/EXPAND'
export const NOT_SUPPORTED_URL_PARAM_COMMAND =
  'editor/NOT_SUPPORTED_URL_PARAM_COMMAND'

// Supported commands
const validCommandTypes: { [key: string]: (args: string[]) => string } = {
  play: args => `:play ${args.join(' ')}`,
  guide: args => `:guide ${args.join(' ')}`,
  edit: args => args.join('\n'),
  param: args => `:param ${args.join(' ')}`,
  params: args => `:params ${args.join(' ')}`
}

interface SetContentAction {
  type: typeof SET_CONTENT
  message: string
}

export const setContent = (message: string): SetContentAction => ({
  type: SET_CONTENT,
  message
})

interface EditContentAction {
  type: typeof EDIT_CONTENT
  message: string
  id: string
  isProjectFile: boolean
  isStatic: boolean
  name: null | string
  directory: null
}

interface EditContentOptions {
  name?: string | null
  isStatic?: boolean
  isProjectFile?: boolean
}

export const editContent = (
  id = '',
  message: string,
  {
    name = null,
    isStatic = false,
    isProjectFile = false
  }: EditContentOptions = {}
): EditContentAction => ({
  type: EDIT_CONTENT,
  message,
  id,
  isProjectFile,
  isStatic,
  name,
  directory: null
})

export const populateEditorFromUrlEpic: Epic<any, GlobalState> = some$ => {
  return some$
    .ofType(APP_START)
    .merge(some$.ofType(URL_ARGUMENTS_CHANGE))
    .delay(1) // Timing issue. Needs to be detached like this
    .mergeMap(action => {
      if (!action.url) {
        return Rx.Observable.never()
      }
      const cmdParam = getUrlParamValue('cmd', action.url)

      // No URL command param found
      if (!cmdParam || !cmdParam[0]) {
        return Rx.Observable.never()
      }

      // Not supported URL param command
      if (!Object.keys(validCommandTypes).includes(cmdParam[0])) {
        return Rx.Observable.of({
          type: NOT_SUPPORTED_URL_PARAM_COMMAND,
          command: cmdParam[0]
        })
      }

      const commandType = cmdParam[0]
      // Credits to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
      // for the "decodeURIComponent cannot be used directly to parse query parameters"
      const cmdArgs =
        getUrlParamValue(
          'arg',
          decodeURIComponent(action.url.replace(/\+/g, ' '))
        ) || []
      const fullCommand = validCommandTypes[commandType](cmdArgs)

      // Play command is considered safe and can run automatically
      // When running the explicit command, also set flag to skip any implicit init commands

      if (['play', 'guide'].includes(commandType)) {
        return [
          executeCommand(fullCommand, { source: commandSources.url }),
          { type: DISABLE_IMPLICIT_INIT_COMMANDS }
        ]
      }

      return Rx.Observable.of(setContent(fullCommand))
    })
}

export const initializeCypherEditorEpic: Epic<
  { type: typeof APP_START },
  GlobalState
> = actions$ => {
  return actions$
    .ofType(APP_START)
    .take(1)
    .do(() => {
      initalizeCypherSupport()
      setupAutocomplete({
        consoleCommands
      })
    })
    .ignoreElements()
}
export const updateEditorSupportSchemaEpic: Epic<Action, GlobalState> = (
  actions$,
  store
) =>
  actions$
    .filter(isOfType([DB_META_DONE, UPDATE_PARAMS]))
    .do(() => {
      const { params, meta } = store.getState()

      setupAutocomplete({
        consoleCommands,
        functions: meta.functions.map(toFunction),
        labels: meta.labels.map(toLabel),
        parameters: Object.keys(params),
        procedures: meta.procedures.map(toProcedure),
        propertyKeys: meta.properties,
        relationshipTypes: meta.relationshipTypes.map(toRelationshipType)
      })
    })
    .ignoreElements()
