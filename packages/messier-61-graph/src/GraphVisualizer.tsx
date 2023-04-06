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
import { useEffect, useState } from "react";
import { GraphStyleModel } from "./models/GraphStyle";
import { NodeModel } from "./models/Node";
import { RelationshipModel } from "./models/Relationship";
import { VizItem } from "./VizItem";
import { GetNodeNeigtborsFn } from "./event-handler/GraphEventHandlerModel";
import { debounce } from "lodash-es";
import deepmerge from "deepmerge";
import { GraphStats } from "./GraphStats";
import { StyledFullSizeContainer } from "./styles/GraphVisualizerStyled";
import { Graph } from "./Graph";

export interface GraphVisualizerProps {
  nodes: NodeModel[];
  relationships: RelationshipModel[];

  graphStyleData: any;
  updateStyle: (style: any) => void;

  nodeLimitHit: boolean;
  maxNumNeighbors: number;
  useGeneratedDefaultColors: boolean;
  nodePropertiesExpandedByDefault: boolean;

  getNeighbors: (
    nodeId: string,
    currentNeighborIds: string[]
  ) => Promise<{ nodes: NodeModel[]; relationships: RelationshipModel[]; allNeighborsCount: number }>;
}

/**
 * The min width of the panel showing node properties on the right side of the window shown in the green box below:
 *
 * <img src="media://panel-width-illustration.png" width="100%" />
 */
export const PANEL_MIN_WIDTH = 200;

/**
 * The strategy for getting the width of the panel showing node properties on the right side of the window shown in the
 * green box below:
 *
 * <img src="media://panel-width-illustration.png" width="100%" />
 *
 * The width is the smaller of window-width / 5 and {@link PANEL_MIN_WIDTH}
 *
 * @returns a functional object
 */
export const defaultPanelWidth = (): number => Math.max(window.innerWidth / 5, PANEL_MIN_WIDTH);

/**
 * Responsible mainly for the graph styling. TODO - considering renaming GraphVisualizer to reflect the "styling"
 * concern.
 *
 * @param props Standard Component Props
 *
 * @returns a new React component
 */
export function GraphVisualizer(props: GraphVisualizerProps): JSX.Element {
  const [nodes, setNodes] = useState<NodeModel>(this.props.nodes);
  const [relationshiops, setRelationships] = useState<RelationshipModel>(this.props.relationshiops);

  const [selectedItem, setSelectedItem] = useState<VizItem>(
    this.props.nodeLimitHit
      ? {
          type: "status-item",
          item:
            "Not all return nodes are being displayed due to Initial Node Display setting." +
            "Only first ${this.props.nodes.length} nodes are displayed.",
        }
      : {
          type: "canvas",
          item: { nodeCount: props.nodes.length, relationshipCount: props.relationships.length },
        }
  );
  const [hoveredItem, setHoveredItem] = useState<VizItem>(selectedItem);

  const [width, setWidth] = useState<number>(defaultPanelWidth());
  const [freezeLegend, setFreezeLegend] = useState<boolean>(false);
  const [stats, setStats] = useState<GraphStats>({ labels: {}, relationshipTypes: {} });
  const [graphStyle, setGraphStyle] = useState<GraphStyleModel>(
    new GraphStyleModel(this.props.useGeneratedDefaultColors)
  );
  const [styleVersion, setStyleVersion] = useState<number>(0);
  const [nodePropertiesExpanded, setNodePropertiesExpandedByDefault] = useState<boolean>(
    this.props.nodePropertiesExpandedByDefault
  );

  const defaultStyle = graphStyle.toSheet();

  if (props.graphStyleData != null) {
    graphStyle.loadRules(deepmerge(this.defaultStyle, this.props.graphStyleData));
  }

  const getNodeNeighbors: GetNodeNeigtborsFn = (node, currentNeighborIds, callback) => {
    if (currentNeighborIds.length > this.props.maxNumNeighbors) {
      callback([], []);
    }

    if (this.props.getNeighbors != null) {
      this.props.getNeighbors(node.id, currentNeighborIds).then(
        ({ nodes, relationships, allNeighborCount }) => {
          if (allNeighborCount > this.props.maxNumNeighbors) {
            setSelectedItem({
              type: "status-item",
              item: `Rendering was limited to ${this.props.maxNeighbours} of the node's total ${allNeighborCount} neighbours due to browser config maxNeighbours.`,
            });
          }
          callback(nodes, relationships);
        },
        () => callback([], [])
      );
    }
  };

  function onItemMouseOver(item: VizItem): void {
    debounce((hoveredItem: VizItem) => {
      setHoveredItem(hoveredItem);
    }, 200);
  }

  function onItemSelect(item: VizItem): void {
    setSelectedItem(item);
  }

  function onGraphModelChange(stats: GraphStats): void {
    setStats(stats);
    if (this.props.updateStyle != null) {
      this.props.updateStyle(graphStyle.toSheet());
    }
  }

  useEffect(() => {
    setFreezeLegend(false);
    this.props.updateStyle(graphStyle.toSheet());

    if (this.props.graphStyleData != null) {
      this.props.graphStyle.loadRules(deepmerge(this.defaultStyle, this.props.graphStyleData));
      setGraphStyle(graphStyle);
      setStyleVersion(styleVersion + 1);
    } else {
      graphStyle.resetToDefault();
      setFreezeLegend(true);
    }
  }, [this.props.graphStyleData]);

  return (
    <StyledFullSizeContainer id="svg-vis">
      <Graph
        isFullscreen={this.props.isFullscreen}
        relationships={this.state.relationships}
        nodes={this.state.nodes}
        getNodeNeighbours={this.getNodeNeighbours.bind(this)}
        onItemMouseOver={this.onItemMouseOver.bind(this)}
        onItemSelect={this.onItemSelect.bind(this)}
        graphStyle={graphStyle}
        styleVersion={this.state.styleVersion} // cheap way for child to check style updates
        onGraphModelChange={this.onGraphModelChange.bind(this)}
        assignVisElement={this.props.assignVisElement}
        getAutoCompleteCallback={this.props.getAutoCompleteCallback}
        autocompleteRelationships={this.props.autocompleteRelationships}
        setGraph={this.props.setGraph}
        offset={(this.state.nodePropertiesExpanded ? this.state.width + 8 : 0) + 8}
        wheelZoomRequiresModKey={this.props.wheelZoomRequiresModKey}
        wheelZoomInfoMessageEnabled={this.props.wheelZoomInfoMessageEnabled}
        disableWheelZoomInfoMessage={this.props.disableWheelZoomInfoMessage}
        initialZoomToFit={this.props.initialZoomToFit}
        onGraphInteraction={this.props.onGraphInteraction}
      />
      <NodeInspectorPanel
        graphStyle={graphStyle}
        hasTruncatedFields={this.props.hasTruncatedFields}
        hoveredItem={this.state.hoveredItem}
        selectedItem={this.state.selectedItem}
        stats={this.state.stats}
        width={this.state.width}
        setWidth={(width: number) => this.setState({ width: Math.max(panelMinWidth, width) })}
        expanded={this.state.nodePropertiesExpanded}
        toggleExpanded={() => {
          const { nodePropertiesExpanded } = this.state;
          this.props.setNodePropertiesExpandedByDefault(!nodePropertiesExpanded);
          this.setState({ nodePropertiesExpanded: !nodePropertiesExpanded });
        }}
        DetailsPaneOverride={this.props.DetailsPaneOverride}
        OverviewPaneOverride={this.props.OverviewPaneOverride}
      />
    </StyledFullSizeContainer>
  );
}
