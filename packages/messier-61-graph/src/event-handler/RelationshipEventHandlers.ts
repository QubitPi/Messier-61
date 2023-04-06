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
import { RelationshipModel } from "../models/Relationship";
import { RELATIONSHIP_CLICKED, RELATIONSHIP_MOUSE_OUT, RELATIONSHIP_MOUSE_OVER } from "./GraphEventHandlerModel";

/**
 * 
 * @param selection 
 * @param trigger The same function as {@link Visualization!trigger}
 * @returns 
 */
export function relationshipEventHandlers(
  selection: Selection<SVGGElement, RelationshipModel, BaseType, unknown>,
  trigger: (event: string, relationship: RelationshipModel) => void
) {
  const onRelationshipClick = (event: Event, relationship: RelationshipModel) => {
    event.stopPropagation();
    trigger(RELATIONSHIP_CLICKED, relationship);
  }

  /**
   * 
   * @param _event https://stackoverflow.com/a/27637038
   * @param relationship 
   */
  const onRelationshipMouseOver = (_event: Event, relationship: RelationshipModel) => {
    trigger(RELATIONSHIP_MOUSE_OVER, relationship);
  }

  /**
   * 
   * @param _event https://stackoverflow.com/a/27637038
   * @param relationship 
   */
  const onRelationshipMouseOut = (_event: Event, relationship: RelationshipModel) => {
    trigger(RELATIONSHIP_MOUSE_OUT, relationship);
  }

  return selection
    .on("mousedown", onRelationshipClick)
    .on("mouseover", onRelationshipMouseOver)
    .on("mouseout", onRelationshipMouseOut);
}
