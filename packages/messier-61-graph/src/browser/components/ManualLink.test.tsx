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
import { render, screen } from '@testing-library/react'
import React from 'react'

import { ManualLink, ManualLinkProps } from 'browser-components/ManualLink'

const tests: [Omit<ManualLinkProps, 'children'>, string][] = [
  [
    { neo4jVersion: null, chapter: 'graph-algorithms', page: '/' },
    'https://neo4j.com/docs/graph-algorithms/current/'
  ],
  [
    {
      neo4jVersion: '3.5.12',
      chapter: 'cypher-manual',
      page: '/schema/constraints/'
    },
    'https://neo4j.com/docs/cypher-manual/3.5/schema/constraints/'
  ],
  [
    { neo4jVersion: '4.0.0-beta03mr03', chapter: 'driver-manual', page: '' },
    'https://neo4j.com/docs/driver-manual/4.0-preview/'
  ],
  [
    {
      neo4jVersion: '3.4.11',
      chapter: 'driver-manual',
      page: '',
      minVersion: '4.0.0'
    },
    'https://neo4j.com/docs/driver-manual/4.0/'
  ],
  [
    {
      neo4jVersion: '4.0.0-rc01',
      chapter: 'driver-manual',
      page: '',
      minVersion: '3.5.0'
    },
    'https://neo4j.com/docs/driver-manual/4.0-preview/'
  ],
  [
    {
      chapter: 'driver-manual',
      page: '/',
      neo4jVersion: null,
      minVersion: '3.5.0'
    },
    'https://neo4j.com/docs/driver-manual/3.5/'
  ]
]

test.each(tests)('Render correct url for props %o', (props, expected) => {
  render(<ManualLink {...props}>link to manual</ManualLink>)

  const url = screen.getByText('link to manual').getAttribute('href')
  expect(url).toEqual(expected)
})

const movedPages: [
  Omit<ManualLinkProps, 'children' | 'chapter'>,
  Record<string, string>
][] = [
  [
    { neo4jVersion: '3.5.0', page: '/administration/' },
    {
      text: 'Cypher Schema',
      url: 'https://neo4j.com/docs/cypher-manual/3.5/schema/'
    }
  ],
  [
    { neo4jVersion: '4.0.0', page: '/administration/' },
    {
      text: 'link to manual',
      url: 'https://neo4j.com/docs/cypher-manual/4.0/administration/'
    }
  ],
  [
    { neo4jVersion: null, page: '/administration/' },
    {
      text: 'Cypher Manual',
      url: 'https://neo4j.com/docs/cypher-manual/current/'
    }
  ],
  [
    {
      neo4jVersion: '4.3.0',
      page: '/administration/indexes-for-search-performance/'
    },
    {
      text: 'Indexes',
      url: 'https://neo4j.com/docs/cypher-manual/4.3/indexes-for-search-performance/'
    }
  ]
]

test.each(movedPages)(
  'Render correct url for moved page %o',
  (props, expected) => {
    render(
      <ManualLink chapter="cypher-manual" {...props}>
        link to manual
      </ManualLink>
    )
    const url = screen.getByText(expected.text).getAttribute('href')
    expect(url).toEqual(expected.url)
  }
)
