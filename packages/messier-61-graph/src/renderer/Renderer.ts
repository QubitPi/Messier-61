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
import { BaseType, Selection } from "d3-selection";
import { Visualization } from "../Visualization";
import { NodeCaptionLine, NodeModel } from "../models/Node";
import { BORDER_COLOR, BORDER_WIDTH, COLOR, FONT_SIZE, TEXT_COLOR_INTERNAL } from "../models/GraphStyle";
import { RelationshipModel } from "../models/Relationship";

type RendererEventHandler<Datum> = (
  selection: Selection<SVGGElement, Datum, BaseType, unknown>,
  style: Visualization
) => any;

const NODE_RING_RENDERER_NAME = "nodeRing";
const NODE_OUTLINE_RENDERER_NAME = "nodeOutline";
const NODE_CAPTION_RENDERER_NAME = "nodeCaption";

const ARROW_PATH_RENDERER_NAME = "arrowPath";
const RELATIONSHIP_TYPE_RENDERER_NAME = "relationshipType";

export const NODE_RING_STROKE_WIDTH_IN_PX = 8;
export const NO_OP_RENDERER_HANDLER = () => undefined;

export class Renderer<Datum> {
  public name: string;
  public onTick: RendererEventHandler<Datum>;
  public onGraphChange: RendererEventHandler<Datum>;

  constructor({name, onTick, onGraphChange}: {name: string, onTick: RendererEventHandler<Datum>, onGraphChange: RendererEventHandler<Datum>}) {
    this.name = name;
    this.onTick = onTick;
    this.onGraphChange = onGraphChange;
  }
}

const NODE_OUTLINE_RENDERER = new Renderer<NodeModel>({
  name: NODE_OUTLINE_RENDERER_NAME,
  onTick: NO_OP_RENDERER_HANDLER,
  onGraphChange(selection, visualizaiton) {
    return selection
      .selectAll("circle.b-outline")
      .data(node => [node])
      .join("circle")
      .classed("b-outline", true)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (node: NodeModel) => node.radius)
      .attr("fill", (node: NodeModel) => visualizaiton.style.forNode(node).get(COLOR))
      .attr("stroke", (node: NodeModel) => visualizaiton.style.forNode(node).get(BORDER_COLOR))
      .attr("stroke-width", (node: NodeModel) => visualizaiton.style.forNode(node).get(BORDER_WIDTH))
  }
});

const NODE_CAPTION_RENDERER = new Renderer<NodeModel>({
  name: NODE_CAPTION_RENDERER_NAME,
  onTick: NO_OP_RENDERER_HANDLER,
  onGraphChange(selection, visualizaiton) {
    return selection
      .selectAll("text.caption")
      .data((node: NodeModel) => node.caption)
      .join("text")
      // Classed element ensures duplicate data will be removed befoer adding
      .classed("caption", true)
      .attr("text-anchor", 'middle')
      .attr("pointer-events", 'none')
      .attr("x", 0)
      .attr("y", (nodeCaptionLine: NodeCaptionLine) => nodeCaptionLine.baseline)
      .attr(
        "font-size",
        (nodeCaptionLine: NodeCaptionLine) => visualizaiton.style.forNode(nodeCaptionLine.node).get(FONT_SIZE)
      )
      .attr(
        "fill",
        (nodeCaptionLine: NodeCaptionLine) => visualizaiton.style.forNode(nodeCaptionLine.node).get(TEXT_COLOR_INTERNAL)
      )
      .text((nodeCaptionLine: NodeCaptionLine) => nodeCaptionLine.text)
  }
});

/**
 * The hollow ring that shows up around a node when the mouse mouses over a node
 */
const NODE_RING_RENDERER = new Renderer<NodeModel>({
  name: NODE_RING_RENDERER_NAME,
  onTick: NO_OP_RENDERER_HANDLER,
  onGraphChange(selection, visualizaiton) {
    const circles = selection
      .selectAll("circle.ring")
      .data((node: NodeModel) => [node]);

    circles
      .enter()
      .insert("circle", ".b-outline")
      .classed("ring", true)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("stroke-width", `${NODE_RING_STROKE_WIDTH_IN_PX}px`)
      .attr("r", (node: NodeModel) => node.radius + 4)

    return circles.exit().remove();
  }
});

const ARROW_PATH_RENDERER = new Renderer<RelationshipModel>({
  name: ARROW_PATH_RENDERER_NAME,
  onTick(selection, visualization) {
    return selection
      .selectAll<BaseType, RelationshipModel>("path")
      .attr("d", d => d.arrow!.outline(d.shortCaptionLength ?? 0))
  },
  onGraphChange(selection, visualization) {
    return selection
      .selectAll("path.b-outline")
      .data(relationship => [relationship])
      .join("path")
      .classed("b-outline", true)
      .attr("fill", (relationship: RelationshipModel) => visualization.style.forRelationship(relationship).get(COLOR))
      .attr("stroke", "none")
  }
});

const RELATIONSHIP_TYPE_RENDERER = new Renderer<RelationshipModel>({
  name: RELATIONSHIP_TYPE_RENDERER_NAME,
  onTick(selection, visualizaiton) {
    return selection
      .selectAll<BaseType, RelationshipModel>("text")
      .attr("x", relationship => relationship?.arrow?.midShaftPoint?.x ?? 0)
      .attr("y", relationship => (relationship?.arrow?.midShaftPoint?.y ?? 0) + parseFloat(visualizaiton.style.forRelationship(relationship).get(FONT_SIZE)) / 2 - 1)
      .attr("transform", relationship => {
        if (relationship.naturalAngle < 90 || relationship.naturalAngle > 270) {
          // Calibrate text orientation. For example,
          // Dragging a node from 1st quadrant to the 2nd quadrant will change the text view to upside-down, making the
          // text hard to read. Rotating the text 180 degress around midshaft point will turn it back to the normal-view
          return `rotate(180 ${relationship?.arrow?.midShaftPoint?.x ?? 0} ${relationship?.arrow?.midShaftPoint?.y ?? 0})`
        } else {
          return null;
        }
      })
      .text(relationship => relationship.shortCaption ?? "");
  },
  onGraphChange(selection, visualizaiton) {
    return selection
      .selectAll("text")
      .data(relationship => [relationship])
      .join("text")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .attr("font-size", relationship => visualizaiton.style.forRelationship(relationship).get(FONT_SIZE))
      .attr("fill", relationship => visualizaiton.style.forRelationship(relationship).get(`text-color-${relationship.captionLayout}`));
  }
});

export const NODE_RENDERERS = [NODE_OUTLINE_RENDERER, NODE_CAPTION_RENDERER, NODE_RING_RENDERER];
