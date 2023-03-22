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
import {
  Simulation,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY
} from 'd3-force';
import { GraphModel } from '../../../models/Graph';
import { NodeModel } from '../../../models/Node';
import { RelationshipModel } from '../../../models/Relationship';

// Temperature of the simulation. It's a value in the range [0,1] and it
// decreases over time. Can be seen as the probability that a node will move.
const DEFAULT_ALPHA = 1;

// Temperature at which the simulation is stopped.
const DEFAULT_ALPHA_MIN = 0.05;


const FORCE_CENTER_X = 0.03;
const FORCE_CENTER_Y = 0.03;

const FORCE_CHARGE = -400;
const LINK_DISTANCE = 45;
const MAX_PRECOMPUTED_TICKS = 300;
const EXTRA_TICKS_PER_RENDER = 10;

// Friction.
const VELOCITY_DECAY = 0.4;


const FORCE_COLLIDE_RADIUS = (node: NodeModel): number => node.radius + 25;
const FORCE_LINK_DISTANCE = (relationship: RelationshipModel): number =>
  relationship.source.radius + relationship.target.radius + LINK_DISTANCE * 2;

export class ForceSimulation {
  simulation: Simulation<NodeModel, RelationshipModel>;
  simulationTimeout: null | number = null;

  constructor(render: () => void) {
    this.simulation = forceSimulation<NodeModel, RelationshipModel>()
      .velocityDecay(VELOCITY_DECAY)
      .force("charge", forceManyBody().strength(FORCE_CHARGE))
      .force("centerX", forceX(0).strength(FORCE_CENTER_X))
      .force("centerY", forceY(0).strength(FORCE_CENTER_Y))
      .alphaMin(DEFAULT_ALPHA_MIN)
      .on("tick", () => {
        this.simulation.tick(EXTRA_TICKS_PER_RENDER)
        render()
      })
      .stop();
  }

  updateNodes(graph: GraphModel): void {
    const nodes = graph.nodes
  }
}