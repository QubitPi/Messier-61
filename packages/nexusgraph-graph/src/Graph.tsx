// Copyright 2023 Paion Data. All rights reserved.
import React, { useEffect, useRef, useState } from "react";
import { GraphModel } from "./models/Graph";
import {
  GetNodeNeighboursFn,
  GraphEventHandlerModel,
  GraphInteractionCallBack,
} from "./event-handler/GraphEventHandlerModel";
import { GraphStyleModel } from "./GraphStyle";
import { VizItem } from "./VizItem";
import { GraphStats, getGraphStats } from "./GraphStats";
import { Visualization, ZoomLimitsReached, ZoomType } from "./Visualization";
import { WheelZoomInfoOverlay } from "./WheelZoomInfoOverlay";
import { StyledSvgWrapper, StyledZoomButton, StyledZoomHolder } from "./styles/WheelZoomInfoOverlay.styled";
import { ResizeObserver } from "@juggle/resize-observer";
import { RelationshipModel } from "./models/Relationship";
import { NodeModel } from "./models/Node";

const mapProperties = (_: any) => Object.assign({}, ...stringifyValues(_));
const stringifyValues = (obj: any) =>
  Object.keys(obj).map((k) => ({
    [k]: obj[k] === null ? "null" : optionalToString(obj[k]),
  }));

function isNullish(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

function optionalToString(value: any) {
  return !isNullish(value) && typeof value?.toString === "function" ? value.toString() : value;
}

const ZOOM_ICONS_DEFAULT_SIZE_IN_PX = 15;
const ZOOM_ICONS_LARGE_SCALE_FACTOR = 1.2;

export type BasicNode = {
  id: string;
  labels: string[];
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};
export type BasicRelationship = {
  id: string;
  startNodeId: string;
  endNodeId: string;
  type: string;
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export type BasicNodesAndRels = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
};

export type GraphProps = {
  isFullscreen: boolean;
  relationships: readonly BasicRelationship[];
  nodes: readonly BasicNode[];
  getNodeNeighbours: GetNodeNeighboursFn;
  onItemMouseOver: (item: VizItem) => void;
  onItemSelect: (item: VizItem) => void;
  graphStyle: GraphStyleModel;
  styleVersion: number;
  onGraphModelChange: (stats: GraphStats) => void;
  assignVisElement: (svgElement: any, graphElement: any) => void;
  autocompleteRelationships: boolean;
  getAutoCompleteCallback: (
    callback: (internalRelationships: RelationshipModel[], initialRun: boolean) => void
  ) => void;
  setGraph: (graph: GraphModel) => void;
  offset: number;
  wheelZoomRequiresModKey?: boolean;
  wheelZoomInfoMessageEnabled?: boolean;
  disableWheelZoomInfoMessage: () => void;
  initialZoomToFit?: boolean;
  onGraphInteraction?: GraphInteractionCallBack;
};

/**
 * {@link Graph} is NOT responsible for the for pre-calculating the graph data and the visualization properties.
 * Instead it assumes both of them have already been pre-processed and passed in via {@link GraphVisualizer}.
 *
 * @param props
 * @returns
 */
export function Graph(props: GraphProps): JSX.Element {
  const [zoomInLimitReached, setZoomInLimitReached] = useState<boolean>(false);
  const [zoomOutLimitReached, setZoomOutLimitReached] = useState<boolean>(false);
  const [displayingWheelZoomInfoMessage, setDisplayingWheelZoomInfoMessage] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  let visualization: Visualization | null = null;

  const wrapperResizeObserver: ResizeObserver = new ResizeObserver(() => {
    visualization?.resize(props.isFullscreen, !!props.wheelZoomRequiresModKey);
  });

  useEffect(() => {
    return () => {
      wrapperResizeObserver.disconnect();
    };
  }, []);

  useEffect(
    () => {
      if (!svgRef.current) return;

      const measureSize = () => ({
        width: svgRef.current?.parentElement?.clientWidth ?? 200,
        height: svgRef.current?.parentElement?.clientHeight ?? 200,
      });

      const graph = createGraph(props.nodes, props.relationships);
      visualization = new Visualization(
        svgRef.current,
        measureSize,
        handleZoomEvent,
        handleDisplayZoomWheelInfoMessage,
        graph,
        props.graphStyle,
        props.isFullscreen,
        props.wheelZoomRequiresModKey,
        props.initialZoomToFit
      );

      const graphEventHandler = new GraphEventHandlerModel(
        graph,
        visualization,
        props.getNodeNeighbours,
        props.onItemMouseOver,
        props.onItemSelect,
        props.onGraphModelChange,
        props.onGraphInteraction
      );
      graphEventHandler.bindEventHandlers();

      props.onGraphModelChange(getGraphStats(graph));
      visualization.resize(props.isFullscreen, !!props.wheelZoomRequiresModKey);

      if (props.setGraph) {
        props.setGraph(graph);
      }
      if (props.autocompleteRelationships) {
        props.getAutoCompleteCallback((internalRelationships: RelationshipModel[], initialRun: boolean) => {
          if (initialRun) {
            visualization?.init();
            graph.addRelationships(internalRelationships);
            props.onGraphModelChange(getGraphStats(graph));
            visualization?.update({
              updateNodes: false,
              updateRelationships: true,
              restartSimulation: false,
            });
            visualization?.precomputeAndStart();
            graphEventHandler.onItemMouseOut();
          } else {
            graph.addRelationships(internalRelationships);
            props.onGraphModelChange(getGraphStats(graph));
            visualization?.update({
              updateNodes: false,
              updateRelationships: true,
              restartSimulation: false,
            });
          }
        });
      } else {
        visualization?.init();
        visualization?.precomputeAndStart();
      }
      if (props.assignVisElement) {
        props.assignVisElement(svgRef.current, visualization);
      }

      wrapperResizeObserver.observe(svgRef.current);

      visualization?.resize(props.isFullscreen, !!props.wheelZoomRequiresModKey);

      visualization?.update({
        updateNodes: true,
        updateRelationships: true,
        restartSimulation: false,
      });

      function handleZoomEvent(limitsReached: ZoomLimitsReached): void {
        if (
          limitsReached.zoomInLimitReached !== zoomInLimitReached ||
          limitsReached.zoomOutLimitReached !== zoomOutLimitReached
        ) {
          setZoomInLimitReached(limitsReached.zoomInLimitReached);

          setZoomOutLimitReached(limitsReached.zoomOutLimitReached);
        }
      }

      function handleDisplayZoomWheelInfoMessage(): void {
        if (!displayingWheelZoomInfoMessage && props.wheelZoomRequiresModKey && props.wheelZoomInfoMessageEnabled) {
          displayZoomWheelInfoMessage(true);
        }

        function displayZoomWheelInfoMessage(display: boolean): void {
          setDisplayingWheelZoomInfoMessage(display);
        }
      }
    },
    [
      // zoomInLimitReached,
      // zoomOutLimitReached,
      // displayingWheelZoomInfoMessage,
      // props,
      // wrapperRef.current,
      // svgRef.current,
    ]
  );

  function zoomInClicked(): void {
    visualization?.zoomByType(ZoomType.IN);
  }

  function zoomOutClicked(): void {
    visualization?.zoomByType(ZoomType.OUT);
  }

  function zoomToFitClicked(): void {
    visualization?.zoomByType(ZoomType.FIT);
  }

  return (
    <StyledSvgWrapper ref={wrapperRef}>
      <svg className="neod3viz" ref={svgRef} />
      {/* <StyledZoomHolder offset={props.offset} isFullscreen={props.isFullscreen}>
        <StyledZoomButton
          aria-label={"zoom-in"}
          className={"zoom-in"}
          disabled={zoomInLimitReached}
          onClick={zoomInClicked}
        >
          <ZoomInIcon large={props.isFullscreen} />
        </StyledZoomButton>
        <StyledZoomButton
          aria-label={"zoom-out"}
          className={"zoom-out"}
          disabled={zoomOutLimitReached}
          onClick={zoomOutClicked}
        >
          <ZoomOutIcon large={props.isFullscreen} />
        </StyledZoomButton>
        <StyledZoomButton aria-label={"zoom-to-fit"} onClick={zoomToFitClicked}>
          <ZoomToFitIcon large={props.isFullscreen} />
        </StyledZoomButton>
      </StyledZoomHolder> */}
      {props.wheelZoomInfoMessageEnabled && displayingWheelZoomInfoMessage && (
        <WheelZoomInfoOverlay onDisableWheelZoomInfoMessage={props.disableWheelZoomInfoMessage} />
      )}
    </StyledSvgWrapper>
  );
}

function createGraph(nodes: readonly BasicNode[], relationships: readonly BasicRelationship[]): GraphModel {
  const graph = new GraphModel();
  graph.addNodes(mapNodes(nodes));
  graph.addRelationships(mapRelationships(relationships, graph));
  return graph;
}

export function mapNodes(nodes: readonly BasicNode[]): NodeModel[] {
  return nodes.map((node) => new NodeModel(node.id, node.labels, mapProperties(node.properties), node.propertyTypes));
}

export function mapRelationships(relationships: readonly BasicRelationship[], graph: GraphModel): RelationshipModel[] {
  return relationships.map((rel) => {
    const source = graph.findNode(rel.startNodeId);
    const target = graph.findNode(rel.endNodeId);
    return new RelationshipModel(rel.id, source, target, rel.type, mapProperties(rel.properties), rel.propertyTypes);
  });
}

// function ZoomInIcon({ large = false }: { large?: boolean }): JSX.Element {
//   const scale = large ? ZOOM_ICONS_LARGE_SCALE_FACTOR : 1;
//   return (
//     <MagnifyingGlassPlusIcon
//       width={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
//       height={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
//     />
//   );
// }

// function ZoomOutIcon({ large = false }: { large?: boolean }): JSX.Element {
//   const scale = large ? ZOOM_ICONS_LARGE_SCALE_FACTOR : 1;
//   return (
//     <MagnifyingGlassMinusIcon
//       width={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
//       height={scale * ZOOM_ICONS_DEFAULT_SIZE_IN_PX}
//     />
//   );
// }

function ZoomToFitIcon({ large = false }: { large?: boolean }): JSX.Element {
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
}

// declare const MagnifyingGlassPlusIcon: React.ForwardRefExoticComponent<
//   React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
// >;

// declare const MagnifyingGlassMinusIcon: React.ForwardRefExoticComponent<
//   React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
// >;
