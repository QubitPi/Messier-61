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
import { GraphVisualizer } from "../../messier-61-graph";
import { StyledVisContainer } from "./style/VisualizationView.styled";

export interface VisualizationViewProps {
  isFullscreen: boolean;
}

export function VisualizationView(props: VisualizationViewProps): JSX.Element {

  return (
    <StyledVisContainer isFullscreen={props.isFullscreen}>
      <GraphVisualizer
        maxNeighbours={this.props.maxNeighbours}
        hasTruncatedFields={this.state.hasTruncatedFields}
        graphStyleData={this.props.graphStyleData}
        updateStyle={this.props.updateStyle}
        getNeighbours={this.getNeighbours.bind(this)}
        nodes={this.state.nodes}
        autocompleteRelationships={this.props.autoComplete ?? false}
        relationships={this.state.relationships}
        isFullscreen={this.props.isFullscreen}
        assignVisElement={this.props.assignVisElement}
        nodeLimitHit={this.state.nodeLimitHit}
        getAutoCompleteCallback={(
          callback: (rels: BasicRelationship[], initialRun: boolean) => void
        ) => {
          this.autoCompleteCallback = callback
        }}
        setGraph={this.setGraph.bind(this)}
        setNodePropertiesExpandedByDefault={
          this.props.setNodePropertiesExpandedByDefault
        }
        nodePropertiesExpandedByDefault={
          this.props.nodePropertiesExpandedByDefault
        }
        wheelZoomRequiresModKey={!this.props.isFullscreen}
        wheelZoomInfoMessageEnabled={
          this.props.wheelZoomInfoMessageEnabled && !this.props.isFullscreen
        }
        disableWheelZoomInfoMessage={this.props.disableWheelZoomInfoMessage}
        DetailsPaneOverride={DetailsPane}
        OverviewPaneOverride={OverviewPane}
        useGeneratedDefaultColors={false}
        initialZoomToFit
      />
    </StyledVisContainer>
  )
}