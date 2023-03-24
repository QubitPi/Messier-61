import { useEffect, useRef, useState } from "react";
import { GraphEventHandlerModel } from "./GraphEventHandlerModel";
import { GraphModel } from "./models/Graph";
import { GraphStyleModel } from "./models/GraphStyle";
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { Visualization, ZoomType } from "./Visualization";
import { ZoomLimitsReached } from "./ZoomLimitsReached";

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

export type getNeighborsCallback = (
  node: NodeModel,
  neighborsIds: string[],
  callback: (nodes: NodeModel[], relationships: RelationshipModel[]) => void
) => void


export interface GraphProps {
  nodes: NodeModel[],
  relationships: RelationshipModel[],

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
  rightOffset: number

  wheelZoomRequiresModifierKey?: boolean,
  wheelZoomInfoMessageEnabled?: boolean,

  styleVersion: number,
  isFullScreen: boolean,
  graphStyle: GraphStyleModel,
  setGraph: (graph: GraphModel) => void,
  autoCompleteRelationships: boolean,
  autoCompleteCallback: (callback: (relationships: RelationshipModel[], initialRun: boolean) => void) => void,
  getNodeNeighborsCallback: getNeighborsCallback,
  assignVisElementFn: (svgElement: any, graphEelemtn: any) => void,

  onItemMouseOver: (item: any) => void,
  onItemSelect: (item: any) => void,
  onGraphModelChange: (stats: any) => void

}

export function Graph(props: GraphProps): JSX.Element {
  const [zoomInLimitReached, setZoomInLimitReached] = useState<boolean>(false);
  const [zoomOutLimitReached, setZoomOutLimitReached] = useState<boolean>(false);
  const [displayingWheelZoomInfoMessage, setDisplayingWheelZoomInfoMessage] = useState<boolean>(false);

  const svgElement = useRef<SVGSVGElement>(null);
  const wrapperElement = useRef<HTMLDivElement>(null);

  let visualization: Visualization | null = null;

  const wrapperResizeObserver = new ResizeObserver(() => {
    this.visualization?.resize(this.props.isFullScreen, this.props.wheelZoomRequiresModifierKey)
  })

  useEffect(() => {
    if (this.svgElement.current == null) {
      return;
    }

    const measureSize = () => ({
      width: this.svgElement?.parentElement?.clientWidth ?? 200,
      height: this.svgElement?.parentElement?.clientHeight ?? 200
    })

    const graph = GraphModel.withNodesAndRelationships(this.props.nodes, this.props.relationships);
    visualization = new Visualization();

    const graphEventHandler = new GraphEventHandlerModel();
    graphEventHandler.bindEventHandlers();

    this.props.onGraphModelChange(getGraphStats(graph));

    visualization.resize(this.props.isFullScreen, this.props.wheelZoomRequiresModifierKey);
    visualization.update({updateNodes: true, updateRelationships: true, restartSimulation: false});

    if (this.props.setGraph != null) {
      this.props.setGraph(graph);
    }

    if (this.props.autoCompleteRelationships) {
      this.props.autoCompleteCallback()
    } else {
      this.visualization?.init();
      this.visualization?.precomputeAndStart();
    }

    if (this.props.assignVisElementFn != null) {
      this.props.assignVisElementFn(this.svgElement.current, this.visualization);
    }

    this.wrapperResizeObserver.observe(this.svgElement.current);
  }, [this.isFullScreen, this.props]);

  function handleZoomEvent(zoomLimitsReached: ZoomLimitsReached): void {
    setZoomInLimitReached(zoomLimitsReached.zoomInLimitReached);
    setZoomOutLimitReached(zoomLimitsReached.zoomOutLimitReached);
  }

  function handleDisplayZoomWheelInfoMessage(): void {
    if (!displayingWheelZoomInfoMessage && this.props.wheelZoomRequiresModifierKey && this.props.wheelZoomInfoMessageEnabled) {
      setDisplayingWheelZoomInfoMessage(true);
    }
  }

  function zoomInClicked(): void {
    this.visualization?.zoomByType(ZoomType.IN);
  }

  function zoomOutClicked(): void {
    this.visualization?.zoomByType(ZoomType.OUT);
  }

  function zoomToFitClicked(): void {
    this.visualization?.zoomByType(ZoomType.FIT);
  }

  return (
    <StyledSvgWrapper ref={this.wrapperElement}>
      <svg className="neod3viz" ref={this.svgElement} />
      <StyledZoomHolder offset={offset} isFullscreen={isFullscreen}>
        <StyledZoomButton
          aria-label={'zoom-in'}
          className={'zoom-in'}
          disabled={zoomInLimitReached}
          onClick={this.zoomInClicked}
        >
          <ZoomInIcon large={isFullscreen} />
        </StyledZoomButton>
        <StyledZoomButton
          aria-label={'zoom-out'}
          className={'zoom-out'}
          disabled={zoomOutLimitReached}
          onClick={this.zoomOutClicked}
        >
          <ZoomOutIcon large={isFullscreen} />
        </StyledZoomButton>
        <StyledZoomButton
          aria-label={'zoom-to-fit'}
          onClick={this.zoomToFitClicked}
        >
          <ZoomToFitIcon large={isFullscreen} />
        </StyledZoomButton>
      </StyledZoomHolder>
      {wheelZoomInfoMessageEnabled && displayingWheelZoomInfoMessage && (
        <WheelZoomInfoOverlay
          onDisableWheelZoomInfoMessage={disableWheelZoomInfoMessage}
        />
      )}
    </StyledSvgWrapper>
  );
}

function getGraphStats(graph: GraphModel): GraphStats {

}


