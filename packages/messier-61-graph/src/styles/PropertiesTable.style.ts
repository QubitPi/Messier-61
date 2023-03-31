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
import styled from "styled-components";

export const AlternatingTable = styled.table`
  tr:nth-child(even) {
    background: ${(props) => props.theme.alteringTableRowBackground};
  }
  tr:nth-child(odd) {
    background: ${(props) => props.theme.editorBackground};
  }
  font-size: 13px;
  width: 100%;
`;

export const CopyCell = styled.td`
  padding: 2px 5px;
  display: flex;
  justify-content: flex-end;
`;

export const KeyCell = styled.td`
  font-weight: 700;
  vertical-align: top;
  padding: 2px;
  width: 30%;
`;

export const StyledInlineList = styled.ul`
  list-style: none;
  word-break: break-word;
`;

export const ValueCell = styled.td`
  padding: 2px;
  white-space: pre-wrap;
  vertical-align: top;
`;
