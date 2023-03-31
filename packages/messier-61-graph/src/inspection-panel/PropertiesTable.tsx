import { VizItemProperty } from "../models/VizItemProperty";
import { AlternatingTable, CopyCell, KeyCell, StyledInlineList, ValueCell } from "../styles/PropertiesTable.style";
import { ClipboardCopier } from "./ClipboardCopier";

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
const COPY_ICON_SIDE_LENGTH_IN_PX = 12;
const CLIPBOARD_MESSAGE_ON_FAILURE = "Copying text failed";
const CLIPBOARD_MESSAGE_ON_SUCCESS = "✔️ Copied to clipboard";
const CLIPBOARD_FLOATING_INDICATOR_TEXT = "Copy key and value";

export interface PropertiesTableProps {
  visibleProperties: VizItemProperty[];
}

export function PropertiesTable(props: PropertiesTableProps): JSX.Element {
  return (
    <>
      <StyledInlineList>
        <AlternatingTable>
          <tbody data-testid="viz-details-pane-properties-table">
            {props.visibleProperties.map(({ key, type, value }) => (
              <tr key={key} title={type}>
                <KeyCell>
                  <ClickableUrls text={key} />
                </KeyCell>
                <ValueCell>
                  <ExpandableValue value={value} width={nodeInspectorWidth} type={type} />
                </ValueCell>
                <CopyCell>
                  <ClipboardCopier
                    textToCopy={`${key}: ${value}`}
                    indicatorText={CLIPBOARD_FLOATING_INDICATOR_TEXT}
                    messageOnSuccess={CLIPBOARD_MESSAGE_ON_SUCCESS}
                    messageOnFailure={CLIPBOARD_MESSAGE_ON_FAILURE}
                    copyIconSideLength={COPY_ICON_SIDE_LENGTH_IN_PX}
                  />
                </CopyCell>
              </tr>
            ))}
          </tbody>
        </AlternatingTable>
      </StyledInlineList>
      <ShowMoreOrAll total={totalNumItems} shown={visibleProperties.length} moreStep={moreStep} onMore={onMoreClick} />
    </>
  );
}
