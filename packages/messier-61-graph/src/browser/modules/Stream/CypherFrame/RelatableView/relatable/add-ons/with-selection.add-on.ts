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
import { assign, flatMap, map, omit, reduce, values } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'
import {
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectState,
  useRowSelect
} from 'react-table'

import {
  IRelatableStateInstance,
  SelectSetter,
  TableAddOnReturn
} from '../relatable.types'
import arrayHasItems from '../utils/array-has-items'

export interface IWithSelectionOptions<Data extends object = any>
  extends UseRowSelectOptions<Data> {
  onSelectionChange?: SelectSetter<Data>

  // react-table state override https://react-table.js.org/api/useRowSelect
  selectedRowIds?: { [id: string]: boolean }
}

export type IWithSelectionState<Data extends object = any> =
  UseRowSelectState<Data>

export interface IWithSelectionInstance<Data extends object = any>
  extends UseRowSelectInstanceProps<Data>,
    IRelatableStateInstance<Data, IWithSelectionState<Data>> {
  onCustomSelectionChange: SelectSetter<Data>
}

export default function withSelection<Data extends object = any>(
  options: IWithSelectionOptions<Data> = {}
): TableAddOnReturn {
  const {
    selectedRowIds: theirSelectedRowIds,
    onSelectionChange,
    ...tableParams
  } = options
  const [ourSelectedRowIds, setOurSelectedRowIds] = useState<{
    [id: string]: boolean
  }>({})
  const selectedRowIds = theirSelectedRowIds || ourSelectedRowIds
  const stateParams = { selectedRowIds }
  const onCustomSelectionChange: SelectSetter = useCallback(
    (rows, select) => {
      if (onSelectionChange) {
        onSelectionChange(rows, select)

        return
      }

      const newIds = flatMap(rows, ({ id, subRows }) =>
        arrayHasItems(subRows) ? map(subRows, subRow => subRow.id) : [id]
      )

      if (select) {
        setOurSelectedRowIds(
          reduce(newIds, (agg, id) => assign(agg, { [id]: true }), {
            ...selectedRowIds
          })
        )

        return
      }

      setOurSelectedRowIds(omit(selectedRowIds, newIds))
    },
    [onSelectionChange, selectedRowIds]
  )

  return [
    withSelection.name,
    null,
    () => true,
    () =>
      useMemo(
        (): Partial<IWithSelectionInstance> => ({
          ...tableParams,
          onCustomSelectionChange
        }),
        [onCustomSelectionChange, ...values(tableParams)]
      ),
    () => useMemo(() => stateParams, [selectedRowIds]),
    useRowSelect
  ]
}
