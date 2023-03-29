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
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";

export const NODE = "node";
export const RELATIONSHIP = "relationship"
export const CANVAS = "canvas";
export const CONTEXT_MENU_ITEM = "context-menu-item";
export const STATUS_ITEM = "status-item";

export type VizItem = 
  | NodeItem
  | RelationshipItem
  | CanvasItem
  | ContextMenuItem
  | StatusItem

export interface NodeItem {
  type: typeof NODE,
  item: Pick<NodeModel, "id" | "labels" | "propertyList">
}

export interface RelationshipItem {
  type: typeof RELATIONSHIP,
  item: Pick<RelationshipModel, "id" | "type" | "propertyList">
}

export interface CanvasItem {
  type: typeof CANVAS,
  item: {
    nodeCount: number;
    relationshipCount: number;
  }
}


export interface ContextMenuItem {
  type: typeof CONTEXT_MENU_ITEM,
  item: {
    label: string
    content: string
    selection: string
  }
}

export interface StatusItem {
  type: typeof STATUS_ITEM,
  item: string
}
