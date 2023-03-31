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
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { GraphEventHandlerModel } from "./GraphEventHandlerModel";
import { GraphModel } from "./models/Graph";
import { GraphStyleModel } from "./models/GraphStyle";
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { StyledSvgWrapper, StyledZoomButton, StyledZoomHolder } from "./styles/Graph.style";
import { Visualization, ZoomType } from "./Visualization";
import { WheelZoomInfoOverlay } from "./WheelZoomInfoOverlay";
import { ZoomLimitsReached } from "./ZoomLimitsReached";

const ZOOM_ICONS_LARGE_SCALE_FACTOR = 1.2;
const ZOOM_ICONS_DEFAULT_SIZE_IN_PX = 15;

export type getNeighborsCallback = (
  node: NodeModel,
  neighborsIds: string[],
  callback: (nodes: NodeModel[], relationships: RelationshipModel[]) => void
) => void;

export interface GraphProps {
  nodes: NodeModel[];
  relationships: RelationshipModel[];

  /**
   * The amount of shift of the graphing area away from the right side of the browser.
   *
   * The readon is that when `nodePropertiesExpanded = true`, there will be a right panel whose width is determined by
   * this offset
   *
   * <img src="media://offset-illustraion-1.png" width="100%" />
   *
   * When the panel is toggled off, the rightOffset is set to a numch smaller number
   *
   * <img src="media://offset-illustraion-2.png" width="100%" />
   */
  rightOffset: number;

  wheelZoomRequiresModifierKey: boolean;
  wheelZoomInfoMessageEnabled?: boolean;

  styleVersion: number;
  isFullScreen: boolean;
  graphStyle: GraphStyleModel;
  setGraph: (graph: GraphModel) => void;
  autoCompleteRelationships: boolean;
  autoCompleteCallback: (callback: (relationships: RelationshipModel[], initialRun: boolean) => void) => void;
  getNodeNeighborsCallback: getNeighborsCallback;
  assignVisElementFn: (svgElement: any, graphEelemtn: any) => void;

  onItemMouseOver: (item: any) => void;
  onItemSelect: (item: any) => void;
  onGraphModelChange: (stats: any) => void;

  disableWheelZoomInfoMessage: () => void;
}

/**
 *
 * @param props
 * @returns
 */
export function Graph(props: GraphProps): JSX.Element {
  const svgElement = useRef<SVGSVGElement>(null);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const [zoomInLimitReached, setZoomInLimitReached] = useState<boolean>(false);
  const [zoomOutLimitReached, setZoomOutLimitReached] = useState<boolean>(false);
  const [displayingWheelZoomInfoMessage, setDisplayingWheelZoomInfoMessage] = useState<boolean>(false);

  let visualization: Visualization | null = null;

  const wrapperResizeObserver = new ResizeObserver(() => {
    visualization?.resize(props.isFullScreen, props.wheelZoomRequiresModifierKey);
  });
  useEffect(() => {
    return () => {
      wrapperResizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (svgElement.current == null) {
      return;
    }

    const measureSize = () => ({
      width: svgElement.current?.parentElement?.clientWidth ?? 200,
      height: svgElement.current?.parentElement?.clientHeight ?? 200,
    });

    const graph = GraphModel.withNodesAndRelationships(props.nodes, props.relationships);
    visualization = new Visualization();
    const graphEventHandler = new GraphEventHandlerModel();
    graphEventHandler.bindEventHandlers();

    props.onGraphModelChange(getGraphStats(graph));

    visualization.resize(props.isFullScreen, props.wheelZoomRequiresModifierKey);
    visualization.update({ updateNodes: true, updateRelationships: true, restartSimulation: false });

    if (props.setGraph != null) {
      props.setGraph(graph);
    }

    if (props.autoCompleteRelationships) {
      props.autoCompleteCallback();
    } else {
      visualization?.init();
      visualization?.precomputeAndStart();
    }

    if (props.assignVisElementFn != null) {
      props.assignVisElementFn(svgElement.current, visualization);
    }

    wrapperResizeObserver.observe(svgElement.current);
  }, [
    props,
    zoomInLimitReached,
    zoomOutLimitReached,
    displayingWheelZoomInfoMessage,
    svgElement.current,
    wrapperElement.current,
  ]);

  function handleZoomEvent(zoomLimitsReached: ZoomLimitsReached): void {
    setZoomInLimitReached(zoomLimitsReached.zoomInLimitReached);
    setZoomOutLimitReached(zoomLimitsReached.zoomOutLimitReached);
  }

  function handleDisplayZoomWheelInfoMessage(): void {
    if (!displayingWheelZoomInfoMessage && props.wheelZoomRequiresModifierKey && props.wheelZoomInfoMessageEnabled) {
      setDisplayingWheelZoomInfoMessage(true);
    }
  }

  function zoomToFitClicked(): void {}

  return (
    <StyledSvgWrapper ref={wrapperElement}>
      <svg className="neod3viz" ref={svgElement} />
      <StyledZoomHolder offset={props.rightOffset} isFullscreen={props.isFullScreen}>
        <StyledZoomButton
          aria-label={"zoom-in"}
          className={"zoom-in"}
          disabled={zoomInLimitReached}
          onClick={() => visualization?.zoomByType(ZoomType.IN)}
        >
          <ZoomInIcon large={props.isFullScreen} />
        </StyledZoomButton>
        <StyledZoomButton
          aria-label={"zoom-out"}
          className={"zoom-out"}
          disabled={zoomOutLimitReached}
          onClick={() => visualization?.zoomByType(ZoomType.OUT)}
        >
          <ZoomOutIcon large={props.isFullScreen} />
        </StyledZoomButton>
        <StyledZoomButton aria-label={"zoom-to-fit"} onClick={() => visualization?.zoomByType(ZoomType.FIT)}>
          <ZoomToFitIcon large={props.isFullScreen} />
        </StyledZoomButton>
      </StyledZoomHolder>
      {props.wheelZoomInfoMessageEnabled && displayingWheelZoomInfoMessage != null && (
        <WheelZoomInfoOverlay onDisableWheelZoomInfoMessage={props.disableWheelZoomInfoMessage} />
      )}
    </StyledSvgWrapper>
  );
}

function getGraphStats(graph: GraphModel): GraphStats {}

const ZoomInIcon = ({ large = false }: { large?: boolean }): JSX.Element => {
  const scale = large ? ZOOM_ICONS_LARGE_SCALE_FACTOR : 1;
  return (
    <MagnifyingGlassPlusIcon
      width={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
      height={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
    />
  );
};

export const ZoomOutIcon = ({ large = false }: { large?: boolean }): JSX.Element => {
  const scale = large ? ZOOM_ICONS_LARGE_SCALE_FACTOR : 1;
  return (
    <MagnifyingGlassMinusIcon
      width={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
      height={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
    />
  );
};

export const ZoomToFitIcon = ({ large = false }: { large?: boolean }): JSX.Element => {
  const scale = large ? ZOOM_ICONS_LARGE_SCALE_FACTOR : 1;

  return (
    <svg
      width={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
      height={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.6162 17.6164L17.0859 17.0861L17.0859 17.0861L17.6162 17.6164ZM17.6162 6.38354L17.0859 6.91387L17.0859 6.91387L17.6162 6.38354ZM6.38339 6.38354L5.85306 5.85321H5.85306L6.38339 6.38354ZM6.38339 17.6164L6.91372 17.0861L6.91372 17.0861L6.38339 17.6164ZM20.341 3.65901L19.8107 4.18934L20.341 3.65901ZM3.65901 3.65901L4.18934 4.18934L3.65901 3.65901ZM3.65901 20.341L4.18934 19.8107L3.65901 20.341ZM21.75 14.3789C21.75 13.9646 21.4142 13.6289 21 13.6289C20.5858 13.6289 20.25 13.9646 20.25 14.3789H21.75ZM14.3723 20.25C13.9581 20.25 13.6223 20.5858 13.6223 21C13.6223 21.4142 13.9581 21.75 14.3723 21.75V20.25ZM9.75576 21.75C10.17 21.75 10.5058 21.4142 10.5058 21C10.5058 20.5858 10.17 20.25 9.75576 20.25V21.75ZM3.75 14.3789C3.75 13.9646 3.41421 13.6289 3 13.6289C2.58579 13.6289 2.25 13.9646 2.25 14.3789H3.75ZM2.25 9.94377C2.25 10.358 2.58579 10.6938 3 10.6938C3.41421 10.6938 3.75 10.358 3.75 9.94377H2.25ZM9.75576 3.75C10.17 3.75 10.5058 3.41421 10.5058 3C10.5058 2.58579 10.17 2.25 9.75576 2.25V3.75ZM14.3723 2.25C13.9581 2.25 13.6223 2.58579 13.6223 3C13.6223 3.41421 13.9581 3.75 14.3723 3.75V2.25ZM20.25 9.94377C20.25 10.358 20.5858 10.6938 21 10.6938C21.4142 10.6938 21.75 10.358 21.75 9.94377H20.25ZM7.45468 18.8101H16.5449V17.3101H7.45468V18.8101ZM16.5449 18.8101C17.1457 18.8101 17.7218 18.5715 18.1466 18.1467L17.0859 17.0861C16.9424 17.2295 16.7478 17.3101 16.5449 17.3101V18.8101ZM18.1466 18.1467C18.5713 17.7219 18.81 17.1458 18.81 16.5451H17.31C17.31 16.748 17.2294 16.9426 17.0859 17.0861L18.1466 18.1467ZM18.81 16.5451V7.45483H17.31V16.5451H18.81ZM18.81 7.45483C18.81 6.85411 18.5713 6.27798 18.1466 5.85321L17.0859 6.91387C17.2294 7.05734 17.31 7.25194 17.31 7.45483H18.81ZM18.1466 5.85321C17.7218 5.42843 17.1457 5.18979 16.5449 5.18979V6.68979C16.7478 6.68979 16.9424 6.77039 17.0859 6.91387L18.1466 5.85321ZM16.5449 5.18979H7.45468V6.68979H16.5449V5.18979ZM7.45468 5.18979C6.85396 5.18979 6.27784 5.42843 5.85306 5.85321L6.91372 6.91387C7.05719 6.7704 7.25178 6.68979 7.45468 6.68979V5.18979ZM5.85306 5.85321C5.42828 6.27799 5.18964 6.85411 5.18964 7.45483H6.68964C6.68964 7.25193 6.77024 7.05734 6.91372 6.91387L5.85306 5.85321ZM5.18964 7.45483V16.5451H6.68964V7.45483H5.18964ZM5.18964 16.5451C5.18964 17.1458 5.42828 17.7219 5.85306 18.1467L6.91372 17.0861C6.77024 16.9426 6.68964 16.748 6.68964 16.5451H5.18964ZM5.85306 18.1467C6.27783 18.5715 6.85396 18.8101 7.45468 18.8101V17.3101C7.25178 17.3101 7.05719 17.2295 6.91372 17.0861L5.85306 18.1467ZM18.75 21.75C19.5457 21.75 20.3087 21.4339 20.8713 20.8713L19.8107 19.8107C19.5294 20.092 19.1478 20.25 18.75 20.25V21.75ZM20.8713 20.8713C21.4339 20.3087 21.75 19.5457 21.75 18.75H20.25C20.25 19.1478 20.092 19.5294 19.8107 19.8107L20.8713 20.8713ZM21.75 5.25C21.75 4.45435 21.4339 3.69129 20.8713 3.12868L19.8107 4.18934C20.092 4.47064 20.25 4.85218 20.25 5.25H21.75ZM20.8713 3.12868C20.3087 2.56607 19.5457 2.25 18.75 2.25V3.75C19.1478 3.75 19.5294 3.90803 19.8107 4.18934L20.8713 3.12868ZM5.25 2.25C4.45435 2.25 3.69129 2.56607 3.12868 3.12868L4.18934 4.18934C4.47064 3.90804 4.85218 3.75 5.25 3.75V2.25ZM3.12868 3.12868C2.56607 3.69129 2.25 4.45435 2.25 5.25H3.75C3.75 4.85218 3.90804 4.47064 4.18934 4.18934L3.12868 3.12868ZM2.25 18.75C2.25 19.5457 2.56607 20.3087 3.12868 20.8713L4.18934 19.8107C3.90803 19.5294 3.75 19.1478 3.75 18.75H2.25ZM3.12868 20.8713C3.69129 21.4339 4.45435 21.75 5.25 21.75V20.25C4.85218 20.25 4.47064 20.092 4.18934 19.8107L3.12868 20.8713ZM21.75 18.75V14.3789H20.25V18.75H21.75ZM18.75 20.25H14.3723V21.75H18.75V20.25ZM5.25 21.75H9.75576V20.25H5.25V21.75ZM3.75 18.75V14.3789H2.25V18.75H3.75ZM2.25 5.25V9.94377H3.75V5.25H2.25ZM5.25 3.75H9.75576V2.25H5.25V3.75ZM18.75 2.25H14.3723V3.75H18.75V2.25ZM20.25 5.25V9.94377H21.75V5.25H20.25Z"
        fill="currentColor"
      />
    </svg>
  );
};
