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
import { filter, find, map, some } from 'lodash-es'

import { RelatableAction, TableAddOnReturn } from '../relatable.types'

export function getRelatableGlobalActions(
  addOns: TableAddOnReturn[]
): RelatableAction[] {
  return map(
    filter(addOns, ([name]) => Boolean(name)),
    ([name, , predicate]): RelatableAction => [name!, predicate]
  )
}

export function getRelatableTableActions(
  addOns: TableAddOnReturn[]
): RelatableAction[] {
  return map(
    filter(addOns, ([, name]) => Boolean(name)),
    ([, name, predicate]): RelatableAction => [name!, predicate]
  )
}

export function getRelatableAction(
  actions: RelatableAction[],
  name: string
): RelatableAction | undefined {
  return find(actions, ([actionName]) => actionName === name)
}

export function isActionAvailable(
  availableActions: RelatableAction[],
  name: string
): boolean {
  return some(availableActions, ([actionName]) => actionName === name)
}
