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
import { CAPTION, DIAMETER, FONT_SIZE, GraphStyleModel } from "./models/GraphStyle";
import { NodeCaptionLine, NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { RelationshipLayout } from "./RelationshipLayout";

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
export class GraphGeometryModel {
  private style: GraphStyleModel;
  private canvas: HTMLCanvasElement;
  private relationshipLayout: RelationshipLayout;

  /**
   * 
   * @param style 
   */
  constructor(style: GraphStyleModel) {
    this.style = style;
    this.relationshipLayout = new RelationshipLayout(this.style);
    this.canvas = document.createElement("canvas");
  }

  public ontick(graph: GraphModel): void {
    this.relationshipLayout.layoutRelationships(graph);
  }

  public onGraphChange(graph: GraphModel, options: { updateNodes: boolean; updateRelationships: boolean }): void {
    if (options.updateNodes) {
      this.setNodeRadii(graph.nodes)
      this.formatNodeCaptions(graph.nodes)
    }

    if (options.updateRelationships) {
      this.formatRelationshipCaptions(graph.relationships);
      this.relationshipLayout.measureRelationshipCaptions(graph.relationships);
    }
  }

  /**
   * Sets the {@link NodeModel!radius} of a specified list of nodes.
   * 
   * The radius of each node is determined by its the {@link DIAMETER} attributed of its
   * {@link GraphStyleModel!forNode node styling}
   *
   * @param nodes the provided list of nodes to set radii for
   */
  private setNodeRadii(nodes: NodeModel[]): void {
    nodes.forEach(node => {
      node.radius = parseFloat(this.style.forNode(node).get(DIAMETER)) / 2;
    })
  }

  private formatNodeCaptions(nodes: NodeModel[]): void {
    const canvas2DContext = this.canvas.getContext("2d");
    if (canvas2DContext != null) {
      nodes.forEach(node => node.caption = fitCaptionIntoCircle(node, this.style, canvas2DContext));
    }
  }

  private fitCaptionIntoCircle(node: NodeModel, style: GraphStyleModel, canvas2DContext: CanvasRenderingContext2D): NodeCaptionLine[] {
    const fontFamily = "sans-serif";
    const fontSize = parseFloat(style.forNode(node).get(FONT_SIZE));
    // Roughtly calculate max text length the circle can fit
    // Note this is about the total number of character that fit, not the longest line that fit in circle
    // Each character occupies an area of (fontSize) * (fontSize)
    // The number of character that can fit into the circle is the area of the circle devided by the each chracter's
    // occupying area
    const maxCaptionTextLength = Math.floor((Math.pow(node.radius, 2) * Math.PI) / Math.pow(fontSize, 2));
    const nodeText = this.interpolate(style.forNode(node).get(CAPTION), node);
    const captionText = nodeText.length > maxCaptionTextLength ? nodeText.substring(0, maxCaptionTextLength): nodeText;
    
  }

  private interpolate(str: any, item: (NodeModel | RelationshipModel)): string {
    // Type \{([^{}]*)\} into https://regex101.com/ for explaination
    const regex = /\{([^{}]*)\}/g;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement
    let interpolatedString = str.replace(regex, (_match: any, firstCapturedGroup: any) => item.propertyMap[firstCapturedGroup]);
    
    if (interpolatedString.length < 1 && str === "{id}" && (item instanceof NodeModel)) {
      interpolatedString = "<id>"
    }

    if (interpolatedString.length < 1 && str == "{type}" && (item instanceof RelationshipModel)) {
      interpolatedString = "<type>"
    }

    return interpolatedString.replace(/^<(id|type)>$/, (_match: any, firstCapturedGroup: any) => item.propertyMap[firstCapturedGroup]);
  }
}
