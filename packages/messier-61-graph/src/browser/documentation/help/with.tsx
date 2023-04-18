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

import ManualLink from 'browser-components/ManualLink'

const title = 'WITH'
const subtitle = 'A graph query language'
const category = 'cypherHelp'
const content = (
  <>
    <p>
      The <code>WITH</code> clause allows queries to be chained together, piping
      the results from one to be used as starting points or criteria in the
      next.
    </p>
    <div className="links">
      <div className="link">
        <p className="title">Reference</p>
        <p className="content">
          <ManualLink chapter="cypher-manual" page="/clauses/with/">
            WITH
          </ManualLink>{' '}
          manual page
        </p>
      </div>
      <div className="link">
        <p className="title">Related</p>
        <p className="content">
          <a help-topic="match">:help MATCH</a>{' '}
          <a help-topic="return">:help RETURN</a>{' '}
          <a help-topic="cypher">:help Cypher</a>
        </p>
      </div>
    </div>
    <section className="example">
      <figure className="runnable">
        <pre>
          {`MATCH (director:Person)-[:DIRECTED]->(movie)
WITH director, count(movie) as directed ORDER BY directed DESC LIMIT 1
MATCH (hopeful:Person)-[:ACTED_IN]->(movie)
WITH director, hopeful, count(movie) as appearances ORDER BY appearances LIMIT 1
MATCH p=(director)-[*..4]-(hopeful)
RETURN p`}
        </pre>
        <figcaption>
          Find a path from a hopeful actor to Hollywood's most prolific
          director.
        </figcaption>
      </figure>
    </section>
  </>
)

export default { title, subtitle, category, content }
