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
import { OrbGraph } from "./orb";

/**
 * A node has a unique identifier
 */
export interface Node {
  /**
   * Surrogate key
   */
  id: string;
  fields: Object
}

export interface Link {
  /**
   * Surrogate key
   */
  id: string;
  source: string;
  target: string;
  fields: Object;
}

export interface GraphProps {
  nodes: Node[]
  links: Link[]
}

/**
 * Generates a D3 graph whose content is defined by a provided {@link Graph graph data}.
 *
 * @param props An object containing a list of {@link Graph. Node}'s and list of {@link Graph. Link}'s
 *
 * @returns A D3 visualization of network graph
 */
export default function Graph(props: GraphProps): JSX.Element {
  return <OrbGraph container={document.getElementById("root") as HTMLElement} nodes={props.nodes} links={props.links} />;
}
