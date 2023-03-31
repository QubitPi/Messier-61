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
   * Creates a
   * @param style
   */
  constructor(style: GraphStyleModel) {
    this.style = style;
    this.relationshipLayout = new RelationshipLayout(this.style);
    this.canvas = document.createElement("canvas");
  }

  public ontick(graph: GraphModel): void {
    this;
  }

  public onGraphChange(graph: GraphModel, options = { updateNodes: true, updateRelationships: true }): void {}
}
