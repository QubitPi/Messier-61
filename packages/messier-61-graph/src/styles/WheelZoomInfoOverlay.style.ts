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

export const StyledZoomInfo = styled.div`
  background: ${props => props.theme.infoBackground};
  position: relative;
  border: ${props => props.theme.infoBorder};
  border-radius: 4px;
  box-shadow: ${props => props.theme.standardShadow}
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 10px;
  pointer-events: auto;
`

export const StyledZoomInfoIconContainer = styled.div`
  color: ${props => props.theme.infoIconColor};
`

export const StyledZoomInfoOverlay = styled.div`
  position: absolute;
  width: 100%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  pointer-events: none;
`

export const StyledZoomInfoOverlayDoNotDisplayButton = styled.button`
  padding: 0 30px;
  font-size: 12px;
  line-height: 15px;
  border: none;
  outline: none;
  background-color: inherit;
  text-decoration-line: underline;
`

export const StyledZoomInfoText = styled.span`
  line-height: 15px;
`

export const StyledZoomInfoTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`
