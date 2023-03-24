import { GraphModel } from "./models/Graph";
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { Visualization } from "./Visualization";

export type GetNodeNeigtborsFn = (
  node: NodeModel,
  currentNeighborIds: string[],
  callback: (nodes: NodeModel, relationshiops: RelationshipModel) => void
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