// Copyright 2023 Paion Data. All rights reserved.
import React, { TransitionEvent, useEffect, useState } from "react";

import { StyledNodeInspectorContainer } from "../styles/InspectorContainer.styled";

const Closing = "CLOSING";
const Closed = "CLOSED";
const Open = "OPEN";
const Opening = "OPENING";

type DrawerTransitionState = typeof Closing | typeof Closed | typeof Open | typeof Opening;

interface NodeInspectorDrawerProps {
  isOpen: boolean;
  width: number;
  children: JSX.Element;
}

export function NodeInspectorDrawer({ width, isOpen, children }: NodeInspectorDrawerProps): JSX.Element {
  const [transitionState, setTransitionState] = useState<DrawerTransitionState>(isOpen ? Open : Closed);

  useEffect(() => {
    if (isOpen) {
      if (transitionState === Closed || transitionState === Closing) {
        setTransitionState(Opening);
      }
    } else {
      if (transitionState === Open || transitionState === Opening) {
        setTransitionState(Closing);
      }
    }
  }, [isOpen, transitionState]);

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>): void {
    if (event.propertyName !== "width") {
      return;
    }
    if (transitionState === Closing) {
      setTransitionState(Closed);
    }
    if (transitionState === Opening) {
      setTransitionState(Open);
    }
  }

  const drawerIsVisible = transitionState === Opening || transitionState === Open || transitionState === Closing;

  return (
    <StyledNodeInspectorContainer
      paneWidth={isOpen ? width : 0}
      onTransitionEnd={onTransitionEnd}
      //Gets/sets whether tiles will animate to their new position and size.See
      //[shouldAnimate] (https://www.infragistics.com/help/wpf/infragisticswpf.controls.layouts.xamtilemanager~infragistics.controls.layouts.modesettingsbase~shouldanimate)
      shouldAnimate={transitionState !== Open}
    >
      {drawerIsVisible && children}
    </StyledNodeInspectorContainer>
  );
}