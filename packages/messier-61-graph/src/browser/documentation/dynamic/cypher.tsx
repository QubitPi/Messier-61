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

const title = 'Cypher'
const subtitle = 'A graph query language'
const category = 'browserUiCommands'
const filter = ['cypher']
const description = (
  <>
    <p>
      {`Cypher is Neo4j's graph query language. Working with a graph is all
      about understanding patterns of data, which are central to Cypher queries.`}
    </p>
    <p>
      Use
      <code>MATCH</code> clauses for reading data, and
      <code>CREATE</code> or
      <code>MERGE</code> for writing data.
    </p>
    <div className="links">
      <div className="link">
        <p className="title">Documentation</p>
        <p className="content">
          <ManualLink chapter="cypher-manual" page="/">
            Cypher introduction
          </ManualLink>
        </p>
      </div>
      <div className="link">
        <p className="title">Related</p>
        <p className="content">
          <a help-topic="match">:help MATCH</a>
          <a help-topic="where">:help WHERE</a>
          <a help-topic="return">:help RETURN</a>
          <a help-topic="create">:help CREATE</a>
          <a help-topic="merge">:help MERGE</a>
          <a help-topic="delete">:help DELETE</a>
          <a help-topic="detach-delete">:help DETACH DELETE</a>
          <a help-topic="set">:help SET</a>
          <a help-topic="foreach">:help FOREACH</a>
          <a help-topic="with">:help WITH</a>
          <a help-topic="load-csv">:help LOAD CSV</a>
          <a help-topic="unwind">:help UNWIND</a>
          <a help-topic="create-index">:help CREATE INDEX</a>
          <a help-topic="starts-with">:help STARTS WITH</a>
          <a help-topic="ends-with">:help ENDS WITH</a>
          <a help-topic="contains">:help CONTAINS</a>
        </p>
      </div>
      <div className="link">
        <p className="title">Cypher basics guide</p>
        <p className="content">
          <a play-topic="cypher">Play Cypher</a>
        </p>
      </div>
    </div>
    <section className="example">
      <figure>
        <pre>
          {`MATCH <pattern>
WHERE <conditions>
RETURN <expressions>`}
        </pre>
        <figcaption>
          Basic form of a Cypher read statement. (Not executable)
        </figcaption>
      </figure>
    </section>
  </>
)

const footer = (
  <>
    <div className="col-sm-4">
      <h3>Next steps</h3>
      <ul>
        <li>
          <a play-topic="movie-graph">Play movie-graph</a> - Try guides with a
          sample database
        </li>
        <li>
          <a play-topic="start">Play start</a> - Back to getting started
        </li>
      </ul>
    </div>
    <div className="col-sm-4">
      <h3>Documentation</h3>
      <ul className="undecorated">
        <li>
          <ManualLink chapter="cypher-refcard" page="/">
            Cypher Refcard
          </ManualLink>
        </li>
        <li>
          <ManualLink chapter="cypher-manual" page="/">
            The Cypher chapter
          </ManualLink>{' '}
          of the Neo4j Developer Manual
        </li>
      </ul>
    </div>
  </>
)

export default {
  title,
  subtitle,
  category,
  content: null,
  description,
  filter,
  footer
}
