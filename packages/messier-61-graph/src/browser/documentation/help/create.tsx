// Copyright 2023 Paion Data. All rights reserved.
import React from 'react'

import ManualLink from 'browser-components/ManualLink'

const title = 'CREATE'
const subtitle = 'Insert graph data'
const category = 'cypherHelp'
const content = (
  <>
    <p>
      The
      <code>CREATE</code> clause is used to create data by specifying named
      nodes and relationships with inline properties.
    </p>
    <p>
      Use
      <code>MATCH</code> clauses for reading data, and
      <code>CREATE</code> or
      <code>MERGE</code> for writing data.
    </p>
    <div className="links">
      <div className="link">
        <p className="title">Reference</p>
        <p className="content">
          <ManualLink chapter="cypher-manual" page="/clauses/create/">
            CREATE
          </ManualLink>{' '}
          manual page
        </p>
      </div>
      <div className="link">
        <p className="title">Related</p>
        <p className="content">
          <a help-topic="set">:help SET</a>
          <a help-topic="merge">:help MERGE</a>
          <a help-topic="cypher">:help Cypher</a>
        </p>
      </div>
      <div className="link">
        <p className="title">Guide</p>
        <p className="content">
          <a play-topic="cypher">Cypher</a>
        </p>
      </div>
    </div>
    <section className="example">
      <figure>
        <pre className="code runnable">
          {`CREATE (le:Person {name: "Euler" }),
  (db:Person {name: "Bernoulli" }),
  (le)-[:KNOWS {since:1768}]->(db)
  RETURN le, db`}
        </pre>
        <figcaption>Create two related people, returning them.</figcaption>
      </figure>
    </section>
  </>
)
export default { title, subtitle, category, content }
