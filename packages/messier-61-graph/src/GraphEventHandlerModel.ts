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
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { Visualization } from "./Visualization";

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

  private getNodeNeighbors: GetNodeNeigtborsFn;
  //onGraphModelChange: () => void;

  //onItemMouseOver: (item: any) => void;
  //onItemSelected: (item: any) => void;

  //selectedItem: NodeModel | RelationshipModel | null;

  constructor(
    graph: GraphModel,
    visualization: Visualization,
    getNodeNeighbors: GetNodeNeigtborsFn,
  ) {
    this.graph = graph;
    this.visualization = visualization;

    this.getNodeNeighbors = getNodeNeighbors
  }

  public bindEventHandlers(): void {

  }
}