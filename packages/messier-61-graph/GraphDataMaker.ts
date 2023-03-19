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
import type { GraphData, Link, Node } from "./GraphConfig";

/**
 *
 * @param tripples A list of tripples, each element of which represents a Subject-Predicate-Object unit graph.
 *For example
 * @param randomIdGenerator
 * @returns
 */
export function makeGraphFromSvoTripples(tripples: string[][], randomIdGenerator: () => string): GraphData {
  const nodes: Node[] = [];
  const links: Link[] = [];

  tripples.forEach((tripple) => {
    let sourceId = randomIdGenerator();
    let targetId = randomIdGenerator();
    const linkId = randomIdGenerator();

    const sourceNodeName = tripple[0];
    const linkLabel = tripple[1];
    const targetNodeName = tripple[2];

    if (targetNameExistsIn(nodes, sourceNodeName)) {
      sourceId = find(nodes, sourceNodeName).id;
    } else {
      nodes.push({
        id: sourceId,
        name: sourceNodeName,
      });
    }

    if (targetNameExistsIn(nodes, targetNodeName)) {
      targetId = find(nodes, targetNodeName).id;
    } else {
      nodes.push({
        id: targetId,
        name: targetNodeName,
      });
    }

    links.push({
      id: linkId,
      name: linkLabel,
      source: sourceId,
      target: targetId,
    });
  });

  return { nodes, links };
}

function targetNameExistsIn(nodes: Node[], target: string): boolean {
  return nodes.find((node) => node.name === target) !== undefined;
}

function find(nodes: Node[], targetName: string): Node {
  return nodes.find((node) => node.name === targetName) as Node;
}
