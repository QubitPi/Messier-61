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
import { TransitionEvent, useEffect, useState } from "react";
import { StyledNodeInspectorContainer } from "../styles/NodeInspectorDrawerStyled";

const CLOSING = "CLOSING";
const CLOSED = "CLOSED";
const OPEN = "OPEN";
const OPENING = "OPENING";

type DrawerTransitionState = typeof CLOSING | typeof CLOSED | typeof OPEN | typeof OPENING;

export interface NodeInspectorDrawerProps {
  isOpen: boolean;
  width: number;
  children: JSX.Element;
}

export function NodeInspectorDrawer(props: NodeInspectorDrawerProps): JSX.Element {
  const [transitionState, setTransitionState] = useState<DrawerTransitionState>(props.isOpen ? OPEN : CLOSED);

  useEffect(() => {
    if (props.isOpen) {
      if (transitionState === CLOSED || transitionState === CLOSING) {
        setTransitionState(OPENING);
      }
    } else {
      if (transitionState === OPEN || transitionState === OPENING) {
        setTransitionState(CLOSING);
      }
    }
  }, [props.isOpen, transitionState]);

  const drawerIsVisible = transitionState === OPEN || transitionState === OPENING || transitionState === CLOSING;

  return (
    <StyledNodeInspectorContainer paneWidth={!props.isOpen ? 0 : props.width} shouldAnimate={transitionState !== OPEN}>
      {drawerIsVisible && props.children}
    </StyledNodeInspectorContainer>
  );
}
