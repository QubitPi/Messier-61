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
import _ from "lodash";
import type { NodeModel } from "./Node";
import type { RelationshipModel } from "./Relationship";

export class GraphModel {
  private _nodes: NodeModel[];
  private _relationships: RelationshipModel[];

  // maintaning these two map is for performance consideration
  nodeMap: Record<string, NodeModel>;
  relationshipMap: Record<string, RelationshipModel>;

  expandedNodeIdMap: Record<string, string[]>;

  /**
   *
   * @param nodes The provided list of {@link NodeModel nodes}
   * @param relationships The provided list of {@link RelationshipModel relationships}
   * @returns
   */
  static withNodesAndRelationships(nodes: NodeModel[], relationships: RelationshipModel[]): GraphModel {
    const graph = new GraphModel();
    graph.addNodes(nodes);
    graph.addRelationships(relationships);
    return graph;
  }

  constructor() {
    this._nodes = [];
    this._relationships = [];
    this.nodeMap = {};
    this.relationshipMap = {};
    this.expandedNodeIdMap = {};

    this.addNodes = this.addNodes.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.containsNode = this.containsNode.bind(this);
    this.findNode = this.findNode.bind(this);

    this.addRelationships = this.addRelationships.bind(this);
    this.containsRelationship = this.containsRelationship.bind(this);
    this.findRelationship = this.findRelationship.bind(this);

    this.findAllNeighborIdsOfNode = this.findAllNeighborIdsOfNode.bind(this);
    this.findAllRelationshipsToNode = this.findAllRelationshipsToNode.bind(this);
    this.removeConnectedRelationships = this.removeConnectedRelationships.bind(this);
    this.updateNode = this.updateNode.bind(this);

    this.addExpandedNodes = this.addExpandedNodes.bind(this);
    this.collapseNode = this.collapseNode.bind(this);

    this.resetGraph = this.resetGraph.bind(this);
  }

  public get nodes(): NodeModel[] {
    return this._nodes;
  }

  public get relationships(): RelationshipModel[] {
    return this._relationships;
  }

  public addNodes(nodes: NodeModel[]): void {
    for (const node of nodes) {
      if (!this.containsNode(node)) {
        this._nodes.push(node);
        this.nodeMap[node.id] = node;
      }
    }
  }

  public removeNode(node: NodeModel): void {
    if (this.containsNode(node)) {
      this._nodes.splice(this._nodes.map((n) => n.id).indexOf(node.id), 1);

      // eslint-disable-next-line  @typescript-eslint/no-dynamic-delete
      delete this.nodeMap[node.id];
    }
  }

  public containsNode(node: NodeModel): boolean {
    return this.findNode(node.id) != null;
  }

  public findNode(id: string): NodeModel {
    return this.nodeMap[id];
  }

  public addRelationships(relationships: RelationshipModel[]): void {
    for (const relationship of Array.from(relationships)) {
      if (!this.containsRelationship(relationship.id)) {
        this._relationships.push(relationship);
        this.relationshipMap[relationship.id] = relationship;
      }
    }
  }

  public containsRelationship(relationshipId: string): boolean {
    return this.findRelationship(relationshipId) != null;
  }

  public findRelationship(relationshipId: string): RelationshipModel | undefined {
    return this.relationshipMap[relationshipId];
  }

  public findAllNeighborIdsOfNode(nodeId: string): string[] {
    return this.findAllRelationshipsToNode(nodeId).map((relationship) => {
      return relationship.target.id === nodeId ? relationship.source.id : relationship.target.id;
    });
  }

  public findAllRelationshipsToNode(nodeId: string): RelationshipModel[] {
    return this._relationships.filter(
      (relationship) => relationship.source.id === nodeId || relationship.target.id === nodeId
    );
  }

  public removeConnectedRelationships(node: NodeModel): void {
    for (const relationship of Array.from(this.findAllRelationshipsToNode(node.id))) {
      this.updateNode(relationship.source);
      this.updateNode(relationship.target);

      this._relationships.splice(this._relationships.indexOf(relationship), 1);
      // eslint-disable-next-line  @typescript-eslint/no-dynamic-delete
      delete this.relationshipMap[relationship.id];
    }
  }

  private updateNode(node: NodeModel): void {
    if (this.containsNode(node)) {
      this.removeNode(node);

      node.expanded = false;
      node.minified = true;

      this.addNodes([node]);
    }
  }

  public addExpandedNodes(expandingNode: NodeModel, expandedNodes: NodeModel[]): void {
    this.addNodes(expandedNodes);

    for (const expandedNode of Array.from(expandedNodes)) {
      this.expandedNodeIdMap[expandingNode.id] =
        this.expandedNodeIdMap[expandingNode.id] != null
          ? unique(this.expandedNodeIdMap[expandingNode.id].concat([expandedNode.id]))
          : [expandedNode.id];
    }
  }

  public collapseNode(node: NodeModel): void {
    if (!(node.id in this.expandedNodeIdMap)) {
      return;
    }

    this.expandedNodeIdMap[node.id].forEach((id) => {
      const expandedNode = this.nodeMap[id];

      this.collapseNode(expandedNode);
      this.removeConnectedRelationships(expandedNode);
      this.removeNode(expandedNode);
    });

    // eslint-disable-next-line  @typescript-eslint/no-dynamic-delete
    delete this.expandedNodeIdMap[node.id];
  }

  public resetGraph(): void {
    this._nodes = [];
    this._relationships = [];

    this.nodeMap = {};
    this.relationshipMap = {};

    this.expandedNodeIdMap = {};
  }
}

export function unique<T>(list: T[]): T[] {
  return _.uniq(list);
}
