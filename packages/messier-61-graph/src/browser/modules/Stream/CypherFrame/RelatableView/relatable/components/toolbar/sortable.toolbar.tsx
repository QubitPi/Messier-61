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
import { filter, find, get, head, map } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Icon,
  Label,
  List,
  Menu
} from 'semantic-ui-react'
import { FormSelect } from 'semantic-ui-react'

import { IWithSortingInstance, withSorting } from '../../add-ons'
import { RELATABLE_ICONS, SORT_ACTIONS } from '../../relatable.types'
import {
  useRelatableStateContext,
  useRelatableToolbarContext
} from '../../states'
import arrayHasItems from '../../utils/array-has-items'
import { columnHasAction } from '../../utils/column-actions'
import { getRelatableAction } from '../../utils/relatable-actions'
import { getToolbarStateClass } from '../../utils/relatable-state-classes'
import RelatableIcon from '../relatable-icon'
import { ToolbarPopup } from './toolbar-popup'

export default function SortableToolbar() {
  const {
    allColumns: columns,
    state: { sortBy },
    onCustomSortChange
  } = useRelatableStateContext<any, IWithSortingInstance>()
  const [selectedToolbarAction, setToolbar, clearToolbar] =
    useRelatableToolbarContext()
  const isSorted = arrayHasItems(sortBy)

  return (
    <ToolbarPopup
      name={withSorting.name}
      content={
        <SortingPopup
          columns={columns}
          sortBy={sortBy}
          onClose={clearToolbar}
          selectedToolbarAction={selectedToolbarAction}
          onCustomSortChange={onCustomSortChange}
        />
      }
      selectedToolbarAction={selectedToolbarAction}
      onClose={clearToolbar}
    >
      <Menu.Item name="sort" onClick={() => setToolbar(withSorting.name)}>
        <RelatableIcon name={RELATABLE_ICONS.SORT} />
        Sorting
        {isSorted && (
          <Label className={isSorted ? getToolbarStateClass('isSorted') : ''}>
            {sortBy.length}
          </Label>
        )}
      </Menu.Item>
    </ToolbarPopup>
  )
}

function SortingPopup({
  columns,
  sortBy,
  onClose,
  selectedToolbarAction,
  onCustomSortChange
}: any) {
  return (
    <div className="relatable__toolbar-popup relatable__toolbar-sorting-popup">
      {arrayHasItems(sortBy) && (
        <>
          <List>
            {map(sortBy, ({ id, desc }) => {
              const column = find(columns, column => column.id === id)

              return (
                <Label key={id} className="relatable__toolbar-value">
                  {column.render('Header')}: {desc ? 'DESC' : 'ASC'}
                  <Icon
                    name="close"
                    onClick={() =>
                      onCustomSortChange(column, SORT_ACTIONS.SORT_CLEAR)
                    }
                  />
                </Label>
              )
            })}
          </List>
          <Divider />
        </>
      )}
      <SortingForm
        columns={columns}
        selectedToolbarAction={selectedToolbarAction}
        onCustomSortChange={onCustomSortChange}
        onClose={onClose}
      />
    </div>
  )
}

function SortingForm({
  columns,
  onCustomSortChange,
  selectedToolbarAction,
  onClose
}: any) {
  const { availableGlobalActions } = useRelatableStateContext()
  const relatableAction = getRelatableAction(
    availableGlobalActions,
    selectedToolbarAction.name
  )
  const columnsToUse = filter(
    columns,
    column => relatableAction && columnHasAction(column, relatableAction)
  )
  const firstId = get(head(columnsToUse), 'id', undefined)
  const [selectedSort, setSelectedSort] = useState<string>(
    SORT_ACTIONS.SORT_DESC
  )
  const [selectedColumnId, setSelectedColumnId] = useState<any>(firstId)
  const selectedColumn = find(columnsToUse, ({ id }) => id === selectedColumnId)
  const columnOptions = map(filter(columnsToUse, 'canSort'), column => ({
    key: column.id,
    value: column.id,
    text: column.Header
  }))
  const sortOptions = [
    {
      key: SORT_ACTIONS.SORT_DESC,
      value: SORT_ACTIONS.SORT_DESC,
      text: 'Descending'
    },
    {
      key: SORT_ACTIONS.SORT_ASC,
      value: SORT_ACTIONS.SORT_ASC,
      text: 'Ascending'
    }
  ]
  const onSubmit = useCallback(() => {
    onClose()
    onCustomSortChange(selectedColumn, selectedSort)
  }, [onCustomSortChange, selectedColumn, selectedSort])

  return (
    <Form onSubmit={onSubmit} className="relatable__toolbar-sorting-form">
      <Form.Group>
        <Form.Field>
          <FormSelect
            options={columnOptions}
            value={selectedColumnId}
            search
            onChange={(_, { value }) => setSelectedColumnId(value)}
          />
        </Form.Field>
        <Form.Field>
          <FormSelect
            options={sortOptions}
            value={selectedSort}
            search
            searchInput={{ autoFocus: true }}
            onChange={(_, { value }: any) => setSelectedSort(value)}
          />
        </Form.Field>
        <Button
          basic
          icon
          color="black"
          className="relatable__toolbar-popup-button"
          title="Add"
        >
          <Icon name="check" />
        </Button>
      </Form.Group>
    </Form>
  )
}
