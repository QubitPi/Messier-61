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
import React from 'react'

import Filter from '../assets/filter.svg'
import GroupBy from '../assets/group-by.svg'
import SortAsc from '../assets/sort1.svg'
import SortDesc from '../assets/sort2.svg'
import Sort from '../assets/sort.svg'
import { RELATABLE_ICONS } from '../relatable.types'

export interface IRelatableIconProps {
  name: RELATABLE_ICONS
}

export default function RelatableIcon({ name }: IRelatableIconProps) {
  return <img className="relatable__icon" alt={name} src={getNameSrc(name)} />
}

function getNameSrc(name: RELATABLE_ICONS) {
  switch (name) {
    case RELATABLE_ICONS.SORT:
      return Sort
    case RELATABLE_ICONS.SORT_ASC:
      return SortAsc
    case RELATABLE_ICONS.SORT_DESC:
      return SortDesc
    case RELATABLE_ICONS.FILTER:
      return Filter
    case RELATABLE_ICONS.GROUP_BY:
      return GroupBy
    default:
      throw new Error(`${name} is not a valid icon`)
  }
}
