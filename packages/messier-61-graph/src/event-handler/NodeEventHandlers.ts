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
import { D3DragEvent, drag as d3Drag } from 'd3-drag';
import { BaseType, Selection } from 'd3-selection';
import { NodeModel } from '../models/Node';
import { Simulation } from 'd3-force';
import { RelationshipModel } from '../models/Relationship';
import { NODE_CLICKED, NODE_DOUBLE_CLICKED, NODE_MOUSE_OUT, NODE_MOUSE_OVER } from './GraphEventHandlerModel';

/**
 * When dragging we set alphaTarget to a value greater than {@link ForceSimulation!DEFAULT_ALPHA_MIN alphaMin} to
 * prevent the simulation from stopping.
 */
const DRAGGING_ALPHA_TARGET = 0.09

// The lower this value, the lower the movement of nodes that aren't being
// dragged. This also affects the perceived elasticity of relationships, a lower
// value will cause neighboring nodes to take more time to follow the node that
// is being dragged.
const DRAGGING_ALPHA = 0.8
const DEFAULT_ALPHA_TARGET = 0

const TOLERANCE = 25;

export function nodeEventHandlers(
  selection: Selection<SVGGElement, NodeModel, BaseType, unknown>,
  trigger: (event: String, node: NodeModel) => void,
  simulation: Simulation<NodeModel, RelationshipModel>
) {
  let initialDragPosition: [number, number];
  let restartSimulation = false;

  const onNodeClick = (_event: Event, node: NodeModel) => {
    trigger(NODE_CLICKED, node);
  }

  const onNodeDoubleClicked = (_event: Event, node: NodeModel) => {
    trigger(NODE_DOUBLE_CLICKED, node);
  }

  const onNodeMouseOver = (_event: Event, node: NodeModel) => {
    if (node.fx == null && node.fy == null) {
      node.hoverFixed = true;
      node.fx = node.x;
      node.fy = node.y;
    }

    trigger(NODE_MOUSE_OVER, node);
  }

  const onNodeMouseOut = (_event: Event, node: NodeModel) => {
    if (node.hoverFixed) {
      node.hoverFixed = false;
      node.fx = null;
      node.fy = null;
    }

    trigger(NODE_MOUSE_OUT, node);
  }

  const dragStarted = (event: D3DragEvent<SVGGElement, NodeModel, any>) => {
    initialDragPosition = [event.x, event.y];
    restartSimulation = false;
  }

  const dragged = (event: D3DragEvent<SVGGElement, NodeModel, any>, node: NodeModel) => {
    // Math.sqrt was removed to avoid unnecessary computation, since this
    // function is called very often when dragging.
    const distSquared = Math.pow(initialDragPosition[0] - event.x, 2) + Math.pow(initialDragPosition[1] - event.y, 2);

    // This is to prevent clicks/double clicks from restarting the simulation
    if (distSquared > TOLERANCE && !restartSimulation) {
      simulation
        .alphaTarget(DRAGGING_ALPHA_TARGET)
        .alpha(DRAGGING_ALPHA)
        .restart();
    }

    node.hoverFixed = false;
    node.fx = event.x;
    node.fy = event.y;
  }

  const dragended = (_event: D3DragEvent<SVGGElement, NodeModel, any>) => {
    if (restartSimulation) {
      // reset alphaTarget so that the simulation cools down and stops
      simulation.alphaTarget(DEFAULT_ALPHA_TARGET)
    }
  }

  return selection
    .call(
      d3Drag<SVGGElement, NodeModel>()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseover", onNodeMouseOver)
    .on("mouseout", onNodeMouseOut)
    .on("click", onNodeClick)
    // this name is not a joke
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event
    .on("dblclick", onNodeDoubleClicked);
}
