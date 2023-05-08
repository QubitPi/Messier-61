// Copyright 2023 Paion Data. All rights reserved.
import { values } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import {
  Column,
  IdType,
  UseGroupByColumnOptions,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByState,
  useGroupBy
} from 'react-table'

import { ICellProps, ValueAggregate } from '../components/renderers'
import { DEFAULT_AGGREGATE_OPTIONS } from '../constants'
import {
  GroupSetter,
  IRelatableStateInstance,
  TableAddOnReturn
} from '../relatable.types'

export interface IWithGroupingOptions<Data extends object = any>
  extends UseGroupByOptions<Data> {
  defaultAggregate?: string[] | string | ((values: any[]) => any)
  defaultAggregateCell?: React.FC<ICellProps>
  onGroupChange?: GroupSetter<Data>

  // react-table state override https://react-table.js.org/api/useGroupBy
  groupBy?: IdType<Data>[]
}

export type IWithGroupingState<Data extends object = any> =
  UseGroupByState<Data>

export interface IWithGroupingInstance<Data extends object = any>
  extends UseGroupByInstanceProps<Data>,
    IRelatableStateInstance<Data, IWithGroupingState<Data>> {
  onCustomGroupingChange: GroupSetter<Data>
  defaultColumn: Partial<Column<Data> & UseGroupByColumnOptions<Data>>
}

export default function withGrouping<Data extends object = any>(
  options: IWithGroupingOptions<Data> = {}
): TableAddOnReturn {
  const {
    groupBy,
    onGroupChange,
    defaultAggregateCell,
    defaultAggregate = DEFAULT_AGGREGATE_OPTIONS,
    ...rest
  } = options
  const stateParams = groupBy ? { groupBy } : {}
  const onCustomGroupingChange: GroupSetter = useCallback(
    (column, group) => {
      if (onGroupChange) {
        onGroupChange(column, group)

        return
      }

      column.toggleGroupBy()
    },
    [onGroupChange]
  )
  const tableParams = {
    ...rest,
    onCustomGroupingChange,
    defaultColumn: {
      aggregate: defaultAggregate,
      Aggregated: defaultAggregateCell || ValueAggregate
    }
  }

  return [
    withGrouping.name,
    null,
    ({ canGroupBy }) => canGroupBy,
    ({ defaultColumn }) =>
      useMemo(
        (): Partial<IWithGroupingInstance> => ({
          ...tableParams,
          // @ts-ignore
          defaultColumn: {
            ...defaultColumn,
            ...tableParams.defaultColumn
          }
        }),
        [
          onCustomGroupingChange,
          defaultAggregateCell,
          defaultAggregate,
          ...values(rest)
        ]
      ),
    () => useMemo(() => stateParams, [groupBy]),
    useGroupBy
  ]
}
