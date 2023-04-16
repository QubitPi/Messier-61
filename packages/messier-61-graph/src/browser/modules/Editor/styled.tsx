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

interface FullscreenProps {
  isFullscreen: boolean
}

export const Header = styled.div`
  background-color: ${props => props.theme.editorBackground};
  flex-grow: 1;
  min-width: 0; // Without the min width, the editor doesn't shrink on resize in safari
  display: flex;
  border: ${props => props.theme.monacoEditorBorder};
  border-radius: 2px;
`

export const MainEditorWrapper = styled.div<FullscreenProps>`
  background-color: ${props => props.theme.frameBackground};
  border-radius: 2px;
  box-shadow: ${props => props.theme.standardShadow};
  margin: 10px 10px 0 10px;
  ${props =>
    props.isFullscreen &&
    `
      position: fixed;
      top: 0px;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100vh;
      border-radius: 0;
      z-index: 103;
      margin: 0;

      [id^=monaco-] .monaco-editor {
        height: calc(100vh - 20px) !important;
      }
  `}};
`

export const CurrentEditIconContainer = styled.span`
  color: ${props => props.theme.currentEditIconColor};
`

export const EditorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 0;
  width: 0; // needed to prevent the editor from growing the text field
  min-width: 0;

  /*  The monaco editor calculates width of the line number based on the max width of the digits 0-9 and no other characters.
      This causes the line number to sometime line-break, nowrap fixes this.
      The calculation also makes the line sometime be too long which makes the indent of the line number too large. */
  & .active-line-number {
    white-space: nowrap;
  }
`

export const FlexContainer = styled.div`
  display: flex;
  padding: 4px;
`

export const ScriptTitle = styled.div<{ unsaved: boolean }>`
  font-style: ${props => (props.unsaved ? 'italic' : 'normal')};
  border-bottom: 1px solid rgb(77, 74, 87, 0.3);
  padding: 1px;
  padding-left: 5px;
  font-family: 'Fira Code', Monaco, 'Courier New', Terminal, monospace;
  font-size: 14px;
  line-height: 23px;
`
