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
import { useState } from "react";
import { GraphStyleModel } from "../models/GraphStyle";
import { PaneBody, PaneHeader, PaneTitle, PaneWrapper } from "../styles/DefaultPaneStyled";
import { NODE, NodeItem, RELATIONSHIP, RelationshipItem } from "../VizItem";
import { ClipboardCopier } from "./ClipboardCopier";

export const DEFAULT_PANE_PAGE_SIZE = 1000;

export interface DefaultDetailsPaneProps {
  vizItem: NodeItem | RelationshipItem;
  graphstyle: GraphStyleModel;
}

const COPY_ICON_SIDE_LENGTH_IN_PX = 10;
const CLIPBOARD_MESSAGE_ON_FAILURE = "Copying text failed";
const CLIPBOARD_MESSAGE_ON_SUCCESS = "✔️ Copied to clipboard";
const CLIPBOARD_FLOATING_INDICATOR_TEXT = "Copy all properties to clipboard";

/**
 * A pane is a (usually) independently scrollable subsection of a window. window. A panel is an object that is used to group controls and other objects
 *
 * @param props
 * @returns
 */
export function DefaultDetailsPane(props: DefaultDetailsPaneProps): JSX.Element {
  const [maxPropertiesCount, setMaxPropertiesCount] = useState<number>(DEFAULT_PANE_PAGE_SIZE);

  const idProperty = {
    key: "<id>",
    value: `${props.vizItem.item.id}`,
    type: "String",
  };
  const allItemProperties = [idProperty, ...props.vizItem.item.propertyList].sort((first, second) =>
    first.key < second.key ? -1 : 1
  );
  const visibleItemProperties = allItemProperties.slice(0, maxPropertiesCount);

  function handleMorePropertiesClick(extraAmount: number): void {
    setMaxPropertiesCount(maxPropertiesCount + extraAmount);
  }

  return (
    <PaneWrapper>
      <PaneHeader>
        <PaneTitle>
          <span>{`${upperFirst(props.vizItem.type)} properties`}</span>
          <ClipboardCopier
            textToCopy={allItemProperties.map((prop) => `${prop.key}: ${prop.value}`).join("\n")}
            indicatorText={CLIPBOARD_FLOATING_INDICATOR_TEXT}
            messageOnSuccess={CLIPBOARD_MESSAGE_ON_SUCCESS}
            messageOnFailure={CLIPBOARD_MESSAGE_ON_FAILURE}
            copyIconSideLength={COPY_ICON_SIDE_LENGTH_IN_PX}
          />
        </PaneTitle>
        {props.vizItem.type === RELATIONSHIP && (
          <RelType
            selectedRelType={{
              propertyKeys: vizItem.item.propertyList.map((p) => p.key),
              relType: vizItem.item.type,
            }}
            graphStyle={graphStyle}
          />
        )}
        {props.vizItem.type === NODE &&
          props.vizItem.item.labels.map((label: string) => {
            return (
              <NodeLabel
                key={label}
                graphStyle={graphStyle}
                selectedLabel={{
                  label,
                  propertyKeys: vizItem.item.propertyList.map((p) => p.key),
                }}
              />
            );
          })}
      </PaneHeader>
      <PaneBody>
        <PropertiesTable
          visibleProperties={visibleItemProperties}
          onMoreClick={handleMorePropertiesClick}
          moreStep={DETAILS_PANE_STEP_SIZE}
          totalNumItems={allItemProperties.length}
          nodeInspectorWidth={nodeInspectorWidth}
        />
      </PaneBody>
    </PaneWrapper>
  );
}

/**
 * Capitalizes a specified string.
 *
 * @param str The string to be capitalized.
 *
 * @returns the capitalized string
 */
function upperFirst(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}
