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
import { forEach, values } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import {
  IdType,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedState,
  useExpanded
} from 'react-table'

import { ExpandedRow, IRowProps } from '../components/renderers'
import {
  ExpandSetter,
  IRelatableStateInstance,
  TableAddOnReturn
} from '../relatable.types'
import arrayHasItems from '../utils/array-has-items'

export interface IWithExpandedOptions<Data extends object = any>
  extends UseExpandedOptions<Data> {
  onExpandedChange?: ExpandSetter<Data>
  expandedRowComponent?: React.FC<IRowProps>

  // react-table state override https://react-table.js.org/api/useExpanded
  expanded?: IdType<Data>[]
}

export interface IWithExpandedState<Data extends object = any>
  extends UseExpandedState<Data> {
  expandSubRows: false
  CustomExpandedRowComponent: React.FC<IRowProps>
  onCustomExpandedChange: ExpandSetter<Data>
}

export interface IWithExpandedInstance<Data extends object = any>
  extends UseExpandedInstanceProps<Data>,
    IRelatableStateInstance<Data, IWithExpandedState<Data>> {
  expandSubRows: false
  CustomExpandedRowComponent: React.FC<IRowProps>
  onCustomExpandedChange: ExpandSetter<Data>
}

export default function withExpanded<Data extends object = any>(
  options: IWithExpandedOptions<Data> = {}
): TableAddOnReturn {
  const {
    expanded,
    expandedRowComponent = ExpandedRow,
    onExpandedChange,
    ...tableParams
  } = options
  const stateParams = expanded ? { expanded } : {}
  const onCustomExpandedChange: ExpandSetter = useCallback(
    (rows, expand) => {
      if (onExpandedChange) {
        onExpandedChange(rows, expand)

        return
      }

      forEach(rows, row => row.toggleRowExpanded(expand))
    },
    [onExpandedChange]
  )

  return [
    withExpanded.name,
    null,
    ({ subRows }) => arrayHasItems(subRows),
    () =>
      useMemo(
        (): Partial<IWithExpandedInstance> => ({
          ...tableParams,
          expandSubRows: false,
          CustomExpandedRowComponent: expandedRowComponent,
          onCustomExpandedChange
        }),
        [expandedRowComponent, onCustomExpandedChange, ...values(tableParams)]
      ),
    () => useMemo(() => stateParams, [expanded]),
    useExpanded
  ]
}
