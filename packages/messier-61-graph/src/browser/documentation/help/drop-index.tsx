// Copyright 2023 Paion Data. All rights reserved.
import React from 'react'

import ManualLink from 'browser-components/ManualLink'
import VersionConditionalDoc from 'browser-components/VersionConditionalDoc'

const title = 'DROP INDEX'
const subtitle = 'Drop a schema index'
const category = 'schemaClauses'
const content = (
  <>
    <p>
      The <code>DROP INDEX</code> clause will delete an index.
    </p>
    <div className="links">
      <div className="link">
        <p className="title">Reference</p>
        <p className="content">
          <ManualLink
            chapter="cypher-manual"
            page="/administration/indexes-for-search-performance/"
          >
            Indexes for search performance
          </ManualLink>{' '}
          manual page
        </p>
      </div>
      <div className="link">
        <p className="title">Related</p>
        <p className="content">
          <a help-topic="create-index">:help CREATE INDEX</a>
          <a help-topic="cypher">:help Cypher</a>
        </p>
      </div>
    </div>
    <VersionConditionalDoc versionCondition=">=4" includeCurrent={true}>
      <>
        <section className="example">
          <figure>
            <pre className="code runnable standalone-example">
              DROP INDEX IndexName
            </pre>
            <figcaption>
              Drop the index named <code>IndexName</code>.
            </figcaption>
          </figure>
          <figure>
            <pre className="code runnable standalone-example">SHOW INDEXES</pre>
            <figcaption>Show all indexes and see their names.</figcaption>
          </figure>
        </section>
      </>
    </VersionConditionalDoc>
    <VersionConditionalDoc versionCondition="<4" includeCurrent={false}>
      <>
        <section className="example">
          <figure>
            <pre className="code runnable standalone-example">
              DROP INDEX ON :Person(name)
            </pre>
            <figcaption>
              Drop the index on name for all nodes with a Person label.
            </figcaption>
          </figure>
        </section>
      </>
    </VersionConditionalDoc>
  </>
)

export default { title, subtitle, category, content }
