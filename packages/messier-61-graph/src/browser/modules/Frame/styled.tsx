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
import styled from 'styled-components'

import { dim } from 'browser-styles/constants'

type FullscreenProps = { isFullscreen: boolean }
export const StyledFrame = styled.article<FullscreenProps>`
  width: auto;
  background-color: ${props => props.theme.frameBackground};
  border: ${props => props.theme.frameBorder};

  ${props =>
    props.isFullscreen
      ? `margin: 0;
position: fixed;
left: 0;
top: 0;
bottom: 0;
right: 0;
z-index: 130;`
      : 'margin 0;'}

  &:hover .carousel-intro-animation {
    opacity: 0;
  }
  box-shadow: ${props => props.theme.standardShadow};
  border-radius: 2px;
  padding-bottom: 3px;
`

type StyledFrameBodyProps = FullscreenProps & {
  isCollapsed: boolean
  preventOverflow?: boolean
  removePadding?: boolean
  hasSlides?: boolean
}

export const StyledFrameBody = styled.div<StyledFrameBodyProps>`
  flex: 1;
  overflow: ${props => (props.preventOverflow ? 'hidden' : 'auto')};
  min-height: ${dim.frameBodyHeight / 2}px;
  max-height: ${props => {
    if (props.isCollapsed) {
      return 0
    }
    if (props.isFullscreen) {
      return '100%'
    }
    return dim.frameBodyHeight - dim.frameStatusbarHeight + 1 + 'px'
  }};
  display: ${props => (props.isCollapsed ? 'none' : 'flex')};
  flex-direction: row;
  width: 100%;
  padding: 30px 30px 10px 30px;

  ${props =>
    props.hasSlides &&
    `position: relative;
    padding-bottom: 40px;
    padding-left: 40px;
    padding-right: 40px;
  `}

  ${props => props.removePadding && 'padding: 0;'}
`

export const StyledFrameMainSection = styled.div`
  min-width: 0;
  flex: 1 1 auto;
  height: inherit;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StyledFrameAside = styled.div`
  flex: 0 0 20%;
  padding: 0 15px;
  width: 25%;
  font-family: ${props => props.theme.primaryFontFamily};
  font-size: 16px;
  font-weight: 300;
  color: ${props => props.theme.asideText};
  min-width: 120px;
`

export const StyledFrameContents = styled.div<FullscreenProps>`
  font-size: 14px;
  overflow: auto;
  min-height: ${dim.frameBodyHeight / 2}px;
  max-height: ${props =>
    props.isFullscreen
      ? '100vh'
      : dim.frameBodyHeight - dim.frameStatusbarHeight * 2 + 'px'};
  ${props => (props.isFullscreen ? 'height: 100vh' : null)};
  flex: auto;
  display: flex;
  width: 100%;

  p {
    margin: 0 0 20px 0;
  }
`

export const StyledFrameStatusbar = styled.div<FullscreenProps>`
  border-top: ${props => props.theme.inFrameBorder};
  height: ${dim.frameStatusbarHeight - 1}px;
  display: flex;
  flex-direction: row;
  flex: none;
  align-items: center;
  padding-left: 0px;

  .statusBar--success {
    color: ${props => props.theme.success};
  }
`

export const StyledFrameSidebar = styled.ul`
  line-height: 33px;
  width: 45px;
  margin-left: -5px;
  list-style: none;
  padding-left: 0;
  margin: 0;
  border-radius: 2px;
  flex: 0 0 auto;
  background-color: ${props => props.theme.frameSidebarBackground};
  box-shadow: ${props => props.theme.standardShadow};
  z-index: 1;
`

export const StyledFrameTitlebarButtonSection = styled.ul`
  flex: 0 0 auto;
  display: flex;
  margin-left: -5px;
  list-style: none;
  padding-left: 0;
  margin: 0;
  margin-left: auto;
  color: ${props => props.theme.secondaryButtonText};
`

export const StyledFrameEditorContainer = styled.div`
  border-bottom: transparent;
  line-height: 9px;
  color: ${props => props.theme.frameTitlebarText};
  display: flex;
  margin-bottom: 2px;
`

export const StyledFrameCommand = styled.label<{ selectedDb: string | null }>`
  font-family: ${props => props.theme.editorFont};
  color: ${props => props.theme.secondaryButtonText};
  background-color: ${props => props.theme.editorBackground};
  border-radius: 2px;
  padding-left: 6px;
  font-size: 17px;
  line-height: 1.8em;
  margin: 4px 0px 4px 4px;
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  &::before {
    color: ${props => props.theme.promptText};
    content: '${props => (props.selectedDb || '') + '$ '}';
  }
  .disable-font-ligatures & {
    font-variant-ligatures: none !important;
  }
`

export const ContentContainer = styled.div`
  margin: 0px 3px;
  padding: 2px 2px 0 2px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 23px);
`

export const TitleBarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  border-radius: 2px 2px 0 0;
  padding-top: 3px;
  padding-right: 7px;
`
