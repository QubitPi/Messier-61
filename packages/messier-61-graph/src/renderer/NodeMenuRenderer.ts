import { BaseType, Selection } from "d3-selection";
import { Arc, DefaultArcObject, arc as d3Arc } from "d3-shape";
import { NODE_DOUBLE_CLICKED } from "../event-handler/GraphEventHandlerModel";
import { NodeModel } from "../models/Node";
import { NODE_RING_STROKE_WIDTH_IN_PX, NO_OP_RENDERER_HANDLER, Renderer } from "./Renderer";
import { Visualization } from "../Visualization";
import { CONTEXT_MENU_ITEM } from "../VizItem";

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
const DONUT_REMOVE_NODE_RENDERER_NAME = "donutRemoveNode";
const DONUT_EXPAND_NODE_RENDERER_NAME = "donutExpandNode";
const DONUT_UNLOCK_NODE_RENDERER_NAME = "donutUnlockNode";

const ITEM_INDEX_MAP = new Map<string, number>([
  [DONUT_REMOVE_NODE_RENDERER_NAME, 1],
  [DONUT_EXPAND_NODE_RENDERER_NAME, 2],
  [DONUT_UNLOCK_NODE_RENDERER_NAME, 3],
]);

const MENU_ANGLE = (2 * Math.PI) / ITEM_INDEX_MAP.size;

const donutExpandNode = new Renderer<NodeModel>({
  name: DONUT_EXPAND_NODE_RENDERER_NAME,
  onTick: NO_OP_RENDERER_HANDLER,
  onGraphChange(selection, visualizaiton) {
    return createMenuItem(selection, visualizaiton, NODE_DOUBLE_CLICKED, 2, NODE_EXPAND_CLASS_NAME, [-8, -10]);
  },
});

export const EXPAND_COLLAPSE_ICON_KEY = "Expand / Collapse";
export const UNLOCK_ICON_KEY = "Unlock";
export const REMOVE_ICON_KEY = "Remove";

export const NODE_EXPAND_CLASS_NAME = "expand-node";

/**
 * Attatch node menues, 
 * @param selection 
 * @param visualizaiton 
 * @param eventType 
 * @param item 
 * @param className 
 * @param position 
 * @param svgIconKey 
 * @param tooltip 
 */
function createMenuItem(
  selection: Selection<SVGGElement, NodeModel, BaseType, unknown>,
  visualizaiton: Visualization,
  eventType: string,
  item:
    | typeof DONUT_REMOVE_NODE_RENDERER_NAME
    | typeof DONUT_EXPAND_NODE_RENDERER_NAME
    | typeof DONUT_UNLOCK_NODE_RENDERER_NAME,
  className: string,
  position: [number, number],
  svgIconKey: typeof EXPAND_COLLAPSE_ICON_KEY | typeof UNLOCK_ICON_KEY | typeof REMOVE_ICON_KEY,
  tooltip: string
) {
  const tab = selection
    .selectAll(`path.${className}`)
    .data(getSelectedNode)
    .join("path")
    .classed(className, true)
    .classed(CONTEXT_MENU_ITEM, true)
    .attr("d", (node) => drawArc(node.radius, item)());

  const rawSvgIcon = 
}

function getSelectedNode(node: NodeModel) {
  return node.selected ? [node] : [];
}

const DEFAULT_WIDTH = 30;

/**
 * Returns a **function** that draws a menu option around a node using [D3 arc](https://github.com/d3/d3-shape#arcs).
 * 
 * When the return value of this function is used as `someFunction` in `.attr("d", someFunction)`, it is very important
 * to remember that the 2nd argument of `.attr()` must either be
 * [constants or functions](https://www.d3indepth.com/selections/#updating-selections-with-functions), therefore we
 * must end the call with an extra parenthesis, i.e.
 * 
 * ```typescript
 * .attr("d", (node) => drawArc(node.radius, item)());
 * ```
 * 
 * Note the last `()` after the `drawArc(node.radius, item)`, We are calling the function returned by this method.
 * i.e. `fn()`, where `fn = drawArc(node.radius, item)`
 * 
 * @param nodeRadius The radius of the enclusing node
 * @param item The menu type/name to draw arc for. Can only be one of the
 * {@link !DONUT_REMOVE_NODE_RENDERER_NAME}/{@link !DONUT_EXPAND_NODE_RENDERER_NAME}/{@link !DONUT_UNLOCK_NODE_RENDERER_NAME}
 * @param arcWidth The difference between outer arc radius and inner ard radius. Defaults to {@link !DEFAULT_WIDTH}.
 *
 * @returns a [D3 arc](https://github.com/d3/d3-shape#arcs) instance
 */
function drawArc(
  nodeRadius: number,
  item:
    | typeof DONUT_REMOVE_NODE_RENDERER_NAME
    | typeof DONUT_EXPAND_NODE_RENDERER_NAME
    | typeof DONUT_UNLOCK_NODE_RENDERER_NAME,
  arcWidth = DEFAULT_WIDTH
): any {
  const startAngle = MENU_ANGLE * ITEM_INDEX_MAP.get(item)!;
  const endAngle = startAngle + MENU_ANGLE;

  const innerRadius = Math.max(nodeRadius + NODE_RING_STROKE_WIDTH_IN_PX, 20);

  return d3Arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + arcWidth)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .padAngle(0.03)!; // https://github.com/d3/d3-shape#arc_padAngle
}
