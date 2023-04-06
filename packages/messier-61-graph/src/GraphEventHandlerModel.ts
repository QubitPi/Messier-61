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
import { getGraphStats, GraphStats } from "./GraphStats";
import { GraphModel } from "./models/Graph";
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { Visualization } from "./Visualization";
import { RELATIONSHIP } from "./VizItem";
import { CONTEXT_MENU_ITEM } from "./VizItem";
import { NODE } from "./VizItem";
import { CANVAS, VizItem } from "./VizItem";

export const NODE_MOUSE_OVER = "nodeMouseOver";
export const NODE_MOUSE_OUT = "nodeMouseOut";
export const MENU_MOUSE_OVER = "menuMouseOver";
export const MENU_MOUSE_OUT = "menuMouseOut";
export const RELATIONSHIP_MOUSE_OVER = "relationshipMouseOver";
export const RELATIONSHIP_MOUST_OUT = "relationshipMouseOut";
export const RELATIONSHIP_CLICKED = "relationshipClicked";
export const CANVAS_CLICKED = "canvasClicked";
export const NODE_CLOSE = "nodeClose";
export const NODE_CLICKED = "nodeClicked";
export const NODE_DOUBLE_CLICKED = "nodeDoubleClicket";
export const NODE_UNLOCK = "nodeUnlock";

export const NODE_EXPAND = "NODE_EXPAND";
export const NODE_UNPINNED = "NODE_UNPINNED";
export const NODE_DISMISSED = "NODE_DISMISSED";
export type GraphInteraction = typeof NODE_EXPAND | typeof NODE_UNPINNED | typeof NODE_DISMISSED;

export type GetNodeNeigtborsFn = (
  node: NodeModel,
  currentNeighborIds: string[],
  callback: (nodes: NodeModel[], relationshiops: RelationshipModel[]) => void
) => void;

/**
 * An abstarction layer handler for {@link Graph}
 */
export class GraphEventHandlerModel {
  private graph: GraphModel;
  private visualization: Visualization;

  private selectedItem: NodeModel | RelationshipModel | null;
  private getNodeNeighborsFn: GetNodeNeigtborsFn;
  private onGraphModelChange: (graphStats: GraphStats) => void;
  private onItemMouseOver: (item: VizItem) => void;
  private onItemSelected: (item: VizItem) => void;
  private onGraphInteraction: (eventType: GraphInteraction, properties?: Record<string, unknown>) => void;

  constructor(
    graph: GraphModel,
    visualization: Visualization,
    getNodeNeighborsFn: GetNodeNeigtborsFn,
    onGraphModelChange: (graphStats: GraphStats) => void,
    onItemMouseOver: (item: VizItem) => void,
    onItemSelected: (item: VizItem) => void,
    onGraphInteraction: (eventType: GraphInteraction, properties?: Record<string, unknown>) => void
  ) {
    this.graph = graph;
    this.visualization = visualization;

    this.selectedItem = null;
    this.getNodeNeighborsFn = getNodeNeighborsFn;
    this.onGraphModelChange = onGraphModelChange;
    this.onItemMouseOver = onItemMouseOver;
    this.onItemSelected = onItemSelected;
    this.onGraphInteraction = onGraphInteraction;
  }

  public graphModelChange(): void {
    this.onGraphModelChange(getGraphStats(this.graph));
  }

  public selectItem(item: NodeModel | RelationshipModel): void {
    if (this.selectedItem != null) {
      this.selectedItem.selected = false;
    }

    this.selectedItem = item;
    item.selected = true;

    this.visualization.update({
      updateNodes: this.selectedItem instanceof NodeModel,
      updateRelationships: this.selectedItem instanceof RelationshipModel,
      restartSimulation: false,
    });
  }

  public deselectItem(): void {
    if (this.selectedItem != null) {
      this.selectedItem.selected = false;

      this.visualization.update({
        updateNodes: this.selectedItem instanceof NodeModel,
        updateRelationships: this.selectedItem instanceof RelationshipModel,
        restartSimulation: false,
      });

      this.selectedItem = null;
    }

    this.onItemSelected({
      type: CANVAS,
      item: {
        nodeCount: this.graph.nodes.length,
        relationshipCount: this.graph.relationships.length,
      },
    });
  }

  /**
   * When user clicks "hide" donut part of ths menu
   * @param node When
   *
   */
  public nodeClose(node: NodeModel): void {
    this.graph.removeConnectedRelationships(node);
    this.graph.removeNode(node);
    this.deselectItem();
    this.visualization.update({ updateNodes: true, updateRelationships: true, restartSimulation: true });
    this.graphModelChange();
    this.onGraphInteraction(NODE_DISMISSED);
  }

  public nodeClicked(node: NodeModel): void {
    if (node == null) {
      return;
    }

    node.hoverFixed = false;
    node.fx = node.x;
    node.fy = node.y;

    if (node.selected) {
      this.deselectItem();
      return;
    }

    this.selectItem(node);
    this.onItemSelected({ type: NODE, item: node });
  }

  public nodeUnlock(node: NodeModel): void {
    if (node == null) {
      return;
    }

    node.fx = null;
    node.fy = null;

    this.deselectItem();
    this.onGraphInteraction(NODE_UNPINNED);
  }

  public nodeDoubleClicked(node: NodeModel): void {
    if (node.expanded) {
      this.nodeCollapse(node);
      return;
    }

    node.expanded = true;

    this.getNodeNeighborsFn(node, this.graph.findAllNeighborIdsOfNode(node.id), (nodes, relationships) => {
      this.graph.addExpandedNodes(node, nodes);
      this.graph.addRelationships(relationships);
      this.visualization.update({ updateNodes: true, updateRelationships: true, restartSimulation: true });
      this.graphModelChange();
    });

    this.onGraphInteraction(NODE_EXPAND);
  }

  public nodeCollapse(node: NodeModel): void {
    node.expanded = false;
    this.graph.collapseNode(node);
    this.visualization.update({ updateNodes: true, updateRelationships: true, restartSimulation: true });
    this.graphModelChange();
  }

  public onNodeMouseOver(node: NodeModel): void {
    if (node.contextMenu == null) {
      return;
    }

    this.onItemMouseOver({ type: NODE, item: node });
  }

  public onMenuMouseOver(nodeWithMenuOpen: NodeModel): void {
    if (nodeWithMenuOpen.contextMenu == null) {
      throw new Error("'menuMouseOver' triggered without menu");
    }

    this.onItemMouseOver({
      type: CONTEXT_MENU_ITEM,
      item: {
        label: nodeWithMenuOpen.contextMenu.label,
        content: nodeWithMenuOpen.contextMenu.menuContent,
        selection: nodeWithMenuOpen.contextMenu.menuSelection,
      },
    });
  }

  public onRelationshipMouseOver(relationship: RelationshipModel): void {
    this.onItemMouseOver({ type: RELATIONSHIP, item: relationship });
  }

  public onRelationshipClicked(relationship: RelationshipModel): void {
    if (relationship.selected) {
      this.deselectItem();
      return;
    }

    this.selectItem(relationship);
    this.onItemSelected({ type: RELATIONSHIP, item: relationship });
  }

  public onCanvasClicked(): void {
    this.deselectItem();
  }

  public onItemMouseOut(): void {
    this.onItemMouseOver({
      type: CANVAS,
      item: {
        nodeCount: this.graph.nodes.length,
        relationshipCount: this.graph.relationships.length,
      },
    });
  }

  public bindEventHandlers(): void {
    this.visualization
      .on(NODE_MOUSE_OVER, this.onNodeMouseOver.bind(this))
      .on(NODE_MOUSE_OUT, this.onItemMouseOut.bind(this))
      .on(MENU_MOUSE_OVER, this.onMenuMouseOver.bind(this))
      .on(MENU_MOUSE_OUT, this.onItemMouseOut.bind(this))
      .on(RELATIONSHIP_MOUSE_OVER, this.onRelationshipMouseOver.bind(this))
      .on(RELATIONSHIP_MOUST_OUT, this.onItemMouseOut.bind(this))
      .on(RELATIONSHIP_CLICKED, this.onRelationshipClicked.bind(this))
      .on(CANVAS_CLICKED, this.onCanvasClicked.bind(this))
      .on(NODE_CLOSE, this.nodeClose.bind(this))
      .on(NODE_CLICKED, this.nodeClicked.bind(this))
      .on(NODE_DOUBLE_CLICKED, this.nodeDoubleClicked.bind(this))
      .on(NODE_UNLOCK, this.nodeUnlock.bind(this));
    this.onItemMouseOut();
  }
}
