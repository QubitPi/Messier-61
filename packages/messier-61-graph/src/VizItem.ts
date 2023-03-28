import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";

export type VizItem = 
  | NodeItem
  | RelationshipItem
  | CanvasItem
  | ContextMenuItem
  |StatusItem

export interface NodeItem {
  type: "node",
  item: Pick<NodeModel, "id" | "labels" | "propertyList">
}

export interface RelationshipItem {
  type: "relationship",
  item: Pick<RelationshipModel, "id" | "type" | "propertyList">
}

export interface CanvasItem {
  type: "canvas",
  item: {
    nodeCount: number;
    relationshipCount: number;
  }
}


export interface ContextMenuItem {
  type: "context-menu-item",
  item: {
    label: string
    content: string
    selection: string
  }
}

export interface StatusItem {
  type: "status-item",
  item: string
}

