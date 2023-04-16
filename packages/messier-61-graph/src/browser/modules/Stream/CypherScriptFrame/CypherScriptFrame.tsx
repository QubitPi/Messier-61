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
import React from 'react'
import { connect } from 'react-redux'

import FrameBodyTemplate from '../../Frame/FrameBodyTemplate'
import { BaseFrameProps } from '../Stream'
import { Icon } from './Icon'
import { CypherSummary, Summary } from './Summary'
import { ContentSizer, PointerFrameCommand, WrapperCenter } from './styled'
import Accordion from 'browser-components/Accordion/Accordion'
import { StyledStatusSection } from 'browser-components/buttons'
import { StyledFrameTitlebarButtonSection } from 'browser/modules/Frame/styled'
import { Frame, getFrame } from 'shared/modules/frames/framesDuck'
import {
  BrowserRequest,
  getRequest
} from 'shared/modules/requests/requestsDuck'

const isCypher = (str: string) => !str.startsWith(':')

interface CypherScriptFrameProps extends BaseFrameProps {
  frames: Record<string, Frame>
  requests: Record<string, BrowserRequest>
}

function CypherScriptFrame({
  frame,
  frames,
  isFullscreen,
  isCollapsed,
  requests = {}
}: CypherScriptFrameProps): JSX.Element {
  const contents = (
    <WrapperCenter>
      <ContentSizer>
        <Accordion
          data-testid="multi-statement-list"
          render={({ getChildProps }: any) => (
            <div>
              {(frame.statements || []).map((id: string, index: number) => {
                if (!requests[frames[id].requestId]) {
                  return
                }
                const status = requests[frames[id].requestId].status
                const { titleProps, contentProps } = getChildProps({
                  index,
                  defaultActive: ['error'].includes(status)
                })
                const SummaryC = isCypher(frames[id].cmd)
                  ? CypherSummary
                  : Summary
                return (
                  <div key={id}>
                    <Accordion.Title
                      data-testid="multi-statement-list-title"
                      {...titleProps}
                    >
                      <PointerFrameCommand selectedDb={frames[id].useDb}>
                        {frames[id].cmd}
                      </PointerFrameCommand>
                      <StyledFrameTitlebarButtonSection>
                        <StyledStatusSection
                          data-testid="multi-statement-list-icon"
                          title={`Status: ${status}`}
                        >
                          <Icon status={status} />
                        </StyledStatusSection>
                      </StyledFrameTitlebarButtonSection>
                    </Accordion.Title>
                    <Accordion.Content
                      data-testid="multi-statement-list-content"
                      {...contentProps}
                    >
                      <SummaryC
                        status={status}
                        request={requests[frames[id].requestId]}
                      />
                    </Accordion.Content>
                  </div>
                )
              })}
            </div>
          )}
        />
      </ContentSizer>
    </WrapperCenter>
  )
  return (
    <FrameBodyTemplate
      isCollapsed={isCollapsed}
      isFullscreen={isFullscreen}
      contents={contents}
      removePadding
    />
  )
}

const mapStateToProps = (state: any, ownProps: BaseFrameProps) => {
  // frame.statements are added one by one as the frame renders and is undefined on first render
  if (!ownProps.frame.statements) return { frames: {}, requests: {} }
  const frames = ownProps.frame.statements
    .map(id => getFrame(state, id).stack[0])
    .reduce(
      (all: Record<string, Frame>, curr) => ({ ...all, [curr.id]: curr }),
      {}
    )

  const requests = Object.keys(frames)
    .map(id => {
      const requestId = frames[id].requestId
      if (!requestId) return false

      const request = getRequest(state, requestId)
      if (!request) return false

      request.id = requestId
      return request
    })
    .reduce(
      (all: Record<string, BrowserRequest>, curr: BrowserRequest | false) => {
        if (!curr) {
          return all
        }

        all[curr.id!] = curr
        return all
      },
      {}
    )

  return {
    frames,
    requests
  }
}

export default connect(mapStateToProps)(CypherScriptFrame)
