import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { StyledZoomInfo, StyledZoomInfoIconContainer, StyledZoomInfoOverlay, StyledZoomInfoOverlayDoNotDisplayButton, StyledZoomInfoText, StyledZoomInfoTextContainer } from "./styles/WheelZoomInfoOverlay.style";

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
const SMALL_SIZE = 15
const LARGE_SIZE = 20

export const LARGE="large";
export const SMALL="small";
export type IconSize = typeof LARGE | typeof SMALL;
export const InfoIcon = ({ size }: { size?: IconSize }): JSX.Element => {
  return <InformationCircleIcon width={getSize(size)} height={getSize(size)} />
}

export interface WheelZoomInfoOverlayProps {
  onDisableWheelZoomInfoMessage: () => void;
}

export function WheelZoomInfoOverlay(props: WheelZoomInfoOverlayProps): JSX.Element {
  return (
    <StyledZoomInfoOverlay>
      <StyledZoomInfo>
        <StyledZoomInfoTextContainer>
          <StyledZoomInfoIconContainer>
            <InfoIcon />
          </StyledZoomInfoIconContainer>
          <StyledZoomInfoText>{`Use ${getModKeyString()} + scroll to zoom`}</StyledZoomInfoText>
        </StyledZoomInfoTextContainer>
        <StyledZoomInfoOverlayDoNotDisplayButton
          data-testid="wheelZoomInfoCheckbox"
          onClick={() => props.onDisableWheelZoomInfoMessage()}
        >
          {"Don't show again"}
        </StyledZoomInfoOverlayDoNotDisplayButton>
      </StyledZoomInfo>
    </StyledZoomInfoOverlay>
  )
}

const getSize = (size?: IconSize) => size && size === 'large' ? LARGE_SIZE : SMALL_SIZE

const getModKeyString = () => (isMac ? 'Cmd' : 'Ctrl or Shift')
const isMac = /Mac|iPad/.test(navigator.platform)
