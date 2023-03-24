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
import { GraphStyleModel } from "./models/GraphStyle";

export class RelationshipLayout {

  private style: GraphStyleModel;
  private canvas: HTMLCanvasElement;

  constructor(style: GraphStyleModel) {
    this.style = style;
    this.canvas = document.createElement("canvas");
  }

  public layoutRelationships(graph: GraphModel): void {
    const relationships = graph.relationships;
  }
}