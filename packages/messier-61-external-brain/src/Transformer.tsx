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
import { makeGraphDataFromSvoTripples } from "../../messier-61-graph";
import { Link, Node } from "../../messier-61-graph/src/Graph";
import { getSVOof } from "../../messier-61-nlp/BasicSVOParser";

export function transformer(editorLines: string[]): { nodes: Node[], links: Link[] } {
  const svoTripples: string[][] = editorLines
    .map((editorLine) => getSVOof(editorLine))
    .filter((pos) => pos.length === 3);

  return makeGraphDataFromSvoTripples(svoTripples, randomIdGenerator);
}

function randomIdGenerator(): string {
  return Math.random().toString(36).substring(2, 8);
}
