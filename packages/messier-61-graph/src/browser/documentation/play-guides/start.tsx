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

const title = 'Neo4j'
const subtitle = ''
const content = (
  <>
    <div className="teasers">
      <div className="teaser teaser-3">
        <h3>Getting started with Neo4j Browser</h3>
        <p className="lead">Neo4j Browser user interface guide</p>
        <div className="icon-holder">
          <div className="clearfix" />
        </div>
        <button exec-topic="guide intro" className="btn btn-cta">
          Get started
        </button>
      </div>

      <div className="teaser teaser-3">
        <h3>Try Neo4j with live data</h3>
        <p className="lead">
          A complete example graph that demonstrates common query patterns.
        </p>
        <div className="icon-holder">
          <p>Actors & movies in cross-referenced pop culture.</p>
          <div className="clearfix" />
        </div>
        <button exec-topic="guide movie-graph" className="btn btn-cta">
          Open guide
        </button>
      </div>
      <div className="teaser teaser-3">
        <h3>Cypher basics</h3>
        <p className="lead">Intro to Graphs with Cypher </p>

        <ul className="topic-bullets">
          <li>What is a graph database?</li>
          <li>How can I query a graph?</li>
        </ul>
        <div className="clearfix" />
        <button exec-topic="guide cypher" className="btn btn-cta">
          Start querying
        </button>
      </div>
    </div>
    <footer className="tight">
      <p className="text-muted">
        Copyright &copy;
        <a
          target="_blank"
          rel="noreferrer"
          href="http://neo4j.com/"
          className="no-icon"
        >
          {' '}
          Neo4j, Inc
        </a>
        &nbsp;<span>2002–{new Date().getFullYear()}</span>
      </p>
    </footer>
  </>
)

export default { title, subtitle, content }
