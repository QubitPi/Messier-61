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

export const StyledTable = styled.table`
  width: 100%;
  margin-bottom: 0;
`
export const StyledBodyTr = styled.tr`
  background-color: ${props => props.theme.secondaryBackground};
  color: ${props => props.theme.secondaryText};
`
export const StyledTh = styled.th`
  text-align: left;
  height: 39px;
  font-weight: bold;
  padding: 10px 16px 10px 0;
  line-height: 39px;
  border-bottom: ${props => props.theme.inFrameBorder};
`
export const StyledTd = styled.td`
  border-bottom: ${props => props.theme.inFrameBorder};
  vertical-align: top;
  line-height: 26px;
  padding: 10px 16px 10px 0;
`
