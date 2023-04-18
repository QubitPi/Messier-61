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
import { filter, values } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'
import {
  SortingRule,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  useSortBy
} from 'react-table'

import {
  IRelatableStateInstance,
  SORT_ACTIONS,
  SortSetter,
  TableAddOnReturn
} from '../relatable.types'

export interface IWithSortingOptions<Data extends object = any>
  extends UseSortByOptions<Data> {
  onSortChange?: SortSetter<Data>

  // react-table state override https://react-table.js.org/api/useSortBy
  sortBy?: SortingRule<Data>[]
}

export interface IWithSortingState<Data extends object = any>
  extends UseSortByState<Data> {
  onCustomSortChange: SortSetter<Data>
}

export interface IWithSortingInstance<Data extends object = any>
  extends UseSortByInstanceProps<Data>,
    IRelatableStateInstance<Data, IWithSortingState<Data>> {
  onCustomSortChange: SortSetter<Data>
}

export default function withSorting<Data extends object = any>(
  options: IWithSortingOptions<Data> = {}
): TableAddOnReturn {
  const { sortBy: theirSortBy, onSortChange, ...tableParams } = options
  const [ourSortBy, setOurSortBy] = useState<SortingRule<Data>[]>([])
  const sortBy = theirSortBy || ourSortBy
  const stateParams = { sortBy }
  const onCustomSortChange: SortSetter<Data> = useCallback(
    (column, action) => {
      if (onSortChange) {
        onSortChange(column, action)

        return
      }

      const withoutColumn = filter(ourSortBy, ({ id }) => id !== column.id)

      if (action === SORT_ACTIONS.SORT_CLEAR) {
        setOurSortBy(withoutColumn)

        return
      }

      setOurSortBy([
        ...withoutColumn,
        { id: column.id, desc: action === SORT_ACTIONS.SORT_DESC }
      ])
    },
    [onSortChange, ourSortBy, setOurSortBy]
  )

  return [
    withSorting.name,
    withSorting.name,
    ({ canSort }) => canSort,
    () =>
      useMemo(
        (): Partial<IWithSortingInstance> => ({
          ...tableParams,
          onCustomSortChange
        }),
        [onCustomSortChange, ...values(tableParams)]
      ),
    () => useMemo(() => stateParams, [sortBy]),
    useSortBy
  ]
}
