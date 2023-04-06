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
import { GraphModel } from "./models/Graph";

const ALL_SORTS_OF_NODES = "*";
const ALL_SORTS_OF_RELATIONSHIPS = "*";

export type GraphStatsLabel = Record<
  string,
  {
    count: number;
    properties: Record<string, string>;
  }
>;

export type GraphStatsRelationshipTypes = Record<
  string,
  {
    count: number;
    properties: Record<string, string>;
  }
>;

export interface GraphStats {
  labels: GraphStatsLabel;
  relationshipTypes: GraphStatsRelationshipTypes;
}

export function getGraphStats(graph: GraphModel): GraphStats {
  const labelStats: GraphStatsLabel = {};
  if (graph.nodes.length !== 0) {
    labelStats[ALL_SORTS_OF_NODES] = { count: 1, properties: {} };
  }

  const relationshipTypeStats: GraphStatsRelationshipTypes = {};
  if (graph.relationships.length !== 0) {
    labelStats[ALL_SORTS_OF_RELATIONSHIPS] = { count: 1, properties: {} };
  } 

  graph.nodes.forEach((node) => {
    node.labels.forEach((label) => {
      if (labelStats[label] == null) {
        labelStats[label] = { count: 1, properties: node.propertyMap };
      } else {
        labelStats[label].count = labelStats[label].count + 1;
        labelStats[label].properties = { ...labelStats[label].properties, ...node.propertyMap };
      }
    });
  });

  graph.relationships.forEach((relationship) => {
    if (relationshipTypeStats[relationship.type] == null) {
      relationshipTypeStats[relationship.type] = { count: 1, properties: relationship.propertyMap };
    } else {
      relationshipTypeStats[relationship.type].count = relationshipTypeStats[relationship.type].count + 1;
      relationshipTypeStats[relationship.type].properties = {
        ...relationshipTypeStats[relationship.type].properties,
        ...relationship.propertyMap,
      };
    }
  });

  return { labels: labelStats, relationshipTypes: relationshipTypeStats };
}
