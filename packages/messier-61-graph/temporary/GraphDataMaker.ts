/*
 * Copyright 2023 Paion Data. All rights reserved.
 */
import type { GraphData, Link, Node } from "./GraphConfig";

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
export function makeGraphDataFromSvoTripples(tripples: string[][], randomIdGenerator: () => string): GraphData {
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
