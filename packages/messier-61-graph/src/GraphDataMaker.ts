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
import { Link, Node } from "./Graph";

/**
 * Given a list of SVO (subject-verb-object) tripples and a provided random string generator, this function transforms
 * each tripple into a pair of nodes (subject & object) connected by a link (verb), each of which contains a surrogate
 * key generated by the random string generator
 *
 * @param tripples a list of tripples, each element of which represents a Subject-Predicate-Object unit graph.
 * @param randomIdGenerator the specified random string generator used for ID generation for nodes and links
 *
 * @returns the graph representation of the SVO tripples
 */
export function makeGraphDataFromSvoTripples(tripples: string[][], randomIdGenerator: () => string): { nodes: Node[], links: Link[] } {
  const nodes: Node[] = [];
  const links: Link[] = [];

  tripples.forEach((tripple) => {
    let sourceId = randomIdGenerator();
    let targetId = randomIdGenerator();
    const linkId = randomIdGenerator();

    const sourceNodeName = tripple[0];
    const linkLabel = tripple[1];
    const targetNodeName = tripple[2];

    const existingSourceNode: Node = find(nodes, sourceNodeName);
    if (existingSourceNode == null) {
      nodes.push({
        id: sourceId,
        fields: { name: sourceNodeName }
      });
    } else {
      sourceId = existingSourceNode.id;
    }

    const existingTargetNode: Node = find(nodes, targetNodeName);
    if (existingTargetNode == null) {
      nodes.push({
        id: targetId,
        fields: { name: targetNodeName }
      });
    } else {
      targetId = existingTargetNode.id;
    }

    links.push({
      id: linkId,
      fields: { name: linkLabel },
      source: sourceId,
      target: targetId,
    });
  });

  return { nodes, links };
}

function find(nodes: Node[], targetName: string): Node {
  return nodes.find((node) => {
    const fields = node.fields as {[key: string]: any}; // https://stackoverflow.com/a/71402518
    return fields.name === targetName
  }) as Node;
}
