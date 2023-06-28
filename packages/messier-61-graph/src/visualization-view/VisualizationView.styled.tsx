// Copyright 2023 Paion Data. All rights reserved.
import styled from "styled-components";

export const StyledVisContainer = styled.div<{ isFullscreen: boolean }>`
  width: 100%;
  height: ${(props) => (props.isFullscreen ? "100%" : 468 + "px")};
  > svg {
    width: 100%;
  }
  > .neod3viz .node .ring {
    fill: none;
    opacity: 0;
    stroke: #6ac6ff;
  }
  > .neod3viz .node.selected .ring {
    stroke: #fdcc59;
  }
  > .neod3viz .node.selected:hover .ring {
    stroke: #6ac6ff;
  }
  > .neod3viz .node:hover .ring,
  > .neod3viz .node.selected .ring {
    opacity: 0.3;
  }
  > .neod3viz .relationship .overlay {
    opacity: 0;
    fill: #6ac6ff;
  }
  > .neod3viz .relationship.selected .overlay {
    fill: #fdcc59;
  }
  > .neod3viz .relationship.selected:hover .overlay {
    fill: #6ac6ff;
  }
  > .neod3viz .relationship:hover .overlay,
  > .neod3viz .relationship.selected .overlay {
    opacity: 0.3;
  }

  > .neod3viz .remove_node,
  .expand_node:hover {
    border: 2px #000 solid;
  }

  > .neod3viz .b-outline,
  .neod3viz .ring,
  .neod3viz .context-menu-item {
    cursor: pointer;
  }

  > .context-menu-item:hover {
    fill: #b9b9b9;
    font-size: 14px;
  }

  > path.context-menu-item {
    stroke-width: 2px;
    fill: #d2d5da;
  }

  > text.context-menu-item {
    fill: #fff;
    text-anchor: middle;
    pointer-events: none;
    font-size: 14px;
  }
`;
