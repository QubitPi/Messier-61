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

export const CopyIconContainer = styled.span`
  cursor: pointer;
  position: relative;
  color: ${(props) => props.theme.frameControlButtonTextColor};
  font-size: 12px;
`;

export const PaneBody = styled.div`
  height: 100%;
  overflow: auto;
  margin: 14px 0;
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const PaneHeader = styled.div`
  font-size: 16px;
  margin-top: 10px;
  flex: 0 0 auto;
  overflow: auto;
  max-height: 50%;
`;

export const PaneTitle = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const PaneWrapper = styled.div`
  padding: 0 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PopupTextContainer = styled.span`
  position: absolute;
  white-space: nowrap;
  right: 20px;
  bottom: 0;
  border-radius: 2px;
  background-color: ${(props) => props.theme.frameSidebarBackground};
  box-shadow: ${(props) => props.theme.standardShadow};
  color: ${(props) => props.theme.primaryText}
  font-family: ${(props) => props.theme.drawerHeaderFontFamily};
  padding: 0 5px;
`;
