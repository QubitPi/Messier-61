// Copyright 2023 Paion Data. All rights reserved.
import React from 'react'

import DbsOnSystemDb from './partials/dbs-on-systemdb'
import ManualLink from 'browser-components/ManualLink'

const title = 'SHOW DATABASES'
const subtitle = 'List all available databases'
const category = 'administration'
const content = (
  <>
    <p>
      The command <code>SHOW DATABASES</code> can be used to show all available
      databases.
    </p>
    <div className="links">
      <div className="link">
        <p className="title">Reference</p>
        <p className="content">
          <ManualLink
            chapter="cypher-manual"
            page="/administration/databases/#administration-databases-show-databases"
            minVersion="4.0.0"
          >
            SHOW DATABASES
          </ManualLink>{' '}
          manual page
        </p>
      </div>
      <div className="link">
        <p className="title">Related</p>
        <p className="content">
          <a help-topic="create-database">:help CREATE DATABASE</a>{' '}
          <a help-topic="drop-database">:help DROP DATABASE</a>{' '}
          <a help-topic="cypher">:help Cypher</a>
        </p>
      </div>
    </div>
    <section className="example">
      <figure>
        <pre className="code runnable standalone-example">SHOW DATABASES</pre>
      </figure>
    </section>
    <DbsOnSystemDb />
  </>
)
export default { title, subtitle, category, content }
