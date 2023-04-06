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
import { PaneContainer, StyledNodeInspectorTopMenuChevron } from "../styles/NodeInspectorPaneld";
import { NodeInspectorDrawer } from "./NodeInspectionDrawer"
import { Resizable } from 're-resizable'

import { ChevronRightIcon as ChevronRightIconSolid, ChevronLeftIcon as ChevronLeftIconSolid } from '@heroicons/react/24/solid'
import { NODE, RELATIONSHIP, VizItem } from "../VizItem";

/**
 * <img src="media://panel-width-illustration.png" width="100%" />
 * @returns 
 */
export const ChevronLeftIcon = (): JSX.Element => <ChevronLeftIconSolid />

/**
 * <img src="media://panel-width-illustration.png" width="100%" />
 *
 * @returns 
 */
export const ChevronRightIcon = (): JSX.Element => <ChevronRightIconSolid />

export interface NodeInspectorPanelProps {
  width: number;
  setWidth: (width: number) => void;

  expanded: boolean;

  hoveredItem: VizItem;
  selectedItem: VizItem;

  DetailsPaneOverride?: 
}

export function NodeInspectorPanel(props: NodeInspectorPanelProps): JSX.Element {
  const hoveringNodeOrRelationship: boolean =
    props.hoveredItem != null && [NODE, RELATIONSHIP].includes(props.hoveredItem.type);
    const displayedElement = hoveringNodeOrRelationship ? props.hoveredItem : props.selectedItem;

  return (
    <>
      <StyledNodeInspectorTopMenuChevron
        aria-label={ props.expanded ? 'Collapse the node properties display' : 'Expand the node properties display' }
        expanded={props.expanded}
      >
        {props.expanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </StyledNodeInspectorTopMenuChevron>

      <NodeInspectorDrawer width={props.width} isOpen={props.expanded}>
        <Resizable
          size={{
            width: props.width,
            height: '100%'
          }}
          onResize={(_e, _direction, ref, _d) => {
            const width = Number.parseInt(ref.style.width.slice(0, -2))
            props.setWidth(width)
          }}
          data-testid="vizInspector"
        >
          <PaneContainer paneWidth={props.width}>
            {displayedElement.type === NODE || displayedElement.type === RELATIONSHIP
              ? (
                  <DetailsPane
                  vizItem={shownEl}
                  graphStyle={graphStyle}
                  nodeInspectorWidth={width}
                  />
            ) : (
              <OverviewPane
                graphStyle={graphStyle}
                hasTruncatedFields={hasTruncatedFields}
                stats={stats}
                nodeCount={
                  shownEl.type === 'canvas' ? shownEl.item.nodeCount : null
                }
                relationshipCount={
                  shownEl.type === 'canvas'
                    ? shownEl.item.relationshipCount
                    : null
                }
                infoMessage={
                  shownEl.type === 'status-item' ? shownEl.item : null
                }
              />
            )}
          </PaneContainer>
        </Resizable>
      </NodeInspectorDrawer>
    </>
  )
}