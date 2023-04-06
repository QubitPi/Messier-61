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
import { EXTERNAL_CAPTION_LAYOUT, RelationshipCaptionLayout } from "../models/Relationship";

export class StraightArrow {
  public midShaftPoint: { x: number; y: number };
  public shaftLength: number;

  private captionLayout: RelationshipCaptionLayout;

  constructor(
    sourceNodeRadius: number,
    targetNodeRadius: number,
    sourceTargetDistance: number,
    shaftWidth: number,
    headWidth: number,
    headHeight: number,
    captionLayout: RelationshipCaptionLayout
  ) {
    const arrowLength = sourceTargetDistance - (sourceNodeRadius + targetNodeRadius);

    this.shaftLength = arrowLength - headHeight;

  }

  public outline(shortCaptionLength: number): string {
    if (this.captionLayout === EXTERNAL_CAPTION_LAYOUT) {

    }

    return ""
  }

  public overlay(minWidth: number): string {
    return ""
  }
}
