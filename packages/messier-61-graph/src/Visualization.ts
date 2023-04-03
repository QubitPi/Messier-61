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
import { easeCubic } from "d3-ease";
import { BaseType, Selection, select as d3Select } from "d3-selection";
import { ZoomBehavior, zoom as d3Zoom, D3ZoomEvent } from "d3-zoom";
import { GraphModel } from "./models/Graph";
import { GraphStyleModel } from "./models/GraphStyle";
import { ForceSimulation } from "./ForceSimulation";
import { GraphGeometryModel } from "./GraphGeometryModel";
import { ZoomLimitsReached } from "./ZoomLimitsReached";

export enum ZoomType {
  IN = "in",
  OUT = "out",
  FIT = "fit",
}

export const ZOOM_MIN_SCALE = 0.1;
export const ZOOM_MAX_SCALE = 2;

export const CANVAS_CLICKED_EVENT_NAME = "canvasClicked";

export class Visualization {
  private readonly root: Selection<SVGElement, unknown, BaseType, unknown>;
  private baseGroup: Selection<SVGGElement, unknown, BaseType, unknown>;
  private rect: Selection<SVGRectElement, unknown, BaseType, unknown>;
  private gContainer: Selection<SVGGElement, unknown, BaseType, unknown>;

  private isFullScreen: boolean;
  private style: GraphStyleModel;
  private geometry: GraphGeometryModel;
  private measureSize: () => { width: number; height: number };

  private initialZoomToFit: boolean;

  private graph: GraphModel;
  private forceSimulation: ForceSimulation;

  private isPanning = false;
  private isZoomClick = false;
  private wheelZoomRequiresModifierKey: boolean;
  private zoomBehavior: ZoomBehavior<SVGElement, unknown>;

  private callbacks: Record<string, undefined | Array<(...args: any[]) => void>> = {};

  constructor(
    element: SVGElement,
    graph: GraphModel,
    
    style: GraphStyleModel,
    measureSize: () => { width: number; height: number },

    isFullScreen: boolean,
    initialZoomToFit: boolean,
    wheelZoomRequiresModifierKey: boolean,
    onDisplayZoomWheelInfoMessage: () => void,
    onZoomEvent: (zoomLimitReached: ZoomLimitsReached) => void
  ) {
    this.root = d3Select(element);

    this.root.selectAll("g").remove(); // Remove base group element when re-creating the visualization
    this.baseGroup = this.root.append("g").attr("transform", "translate(0, 0)");

    this.rect = this.baseGroup
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("x", () => -Math.floor(measureSize().width / 2))
      .attr("y", () => Math.floor(measureSize().height / 2))
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("transform", "scale(1)")
      .on("click", () => {
        if (!this.isPanning) {
          return this.trigger(CANVAS_CLICKED_EVENT_NAME);
        }
      });
    this.gContainer = this.baseGroup.append("g");

    this.isFullScreen = isFullScreen;
    this.style = style;
    this.geometry = new GraphGeometryModel(style);
    this.measureSize = measureSize;

    this.initialZoomToFit = initialZoomToFit

    this.graph = graph;
    this.forceSimulation = new ForceSimulation(this.render.bind(this));

    this.wheelZoomRequiresModifierKey = wheelZoomRequiresModifierKey;
    this.zoomBehavior = d3Zoom<SVGElement, unknown>()
      .scaleExtent([ZOOM_MIN_SCALE, ZOOM_MAX_SCALE])
      .on("zoom", (event: D3ZoomEvent<SVGElement, unknown>) => {
        const wasZoomClick = this.isZoomClick;

        this.isPanning = true;
        this.isZoomClick = false;

        const currentZoomScale = event.transform.k;
        const zoomLimitsReached: ZoomLimitsReached = {
          zoomInLimitReached: currentZoomScale >= ZOOM_MAX_SCALE,
          zoomOutLimitReached: currentZoomScale <= ZOOM_MIN_SCALE,
        };

        onZoomEvent(zoomLimitsReached);

        return this.gContainer
          .transition()
          .duration(wasZoomClick ? 400 : 20)
          .call((containerSelection) => (wasZoomClick ? containerSelection.ease(easeCubic) : containerSelection))
          .attr("transform", String(event.transform));
      })
      // This is the default implementation of wheelDelta function in d3-zoom v3.0.0
      // For some reasons typescript complains when trying to get it by calling zoomBehaviour.wheelDelta() instead
      // but it should be the same (and indeed it works at runtime).
      // https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/README.md#zoom_wheelDelta
      // Keps the zoom behavior constant for metam ctrl and shift key. Otherwise scrolling is faster with ctrl key.
      .wheelDelta((e) => -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002))
      .filter((event) => {
        if (event.type === "wheel") {
          const modKeySelected = event.metaKey || event.ctrlKey || event.shiftKey;
          if (this.wheelZoomRequiresModifierKey && !modKeySelected) {
            onDisplayZoomWheelInfoMessage();
            return false;
          }
        }
        return true;
      });

    this.root
      .call(this.zoomBehavior)
      .on("click.zoom", () => (this.isPanning = false))
      .on("dblclick.zoom", null);
  }

  public init(): void {
    this.gContainer
      .selectAll("g.layer")
      .data(["relationships", "nodes"])
      .join("g")
      .attr("class", (d) => `layer ${d}`);

    this.updateNodes();
    this.updateRelationships();

    this.adjustZoomMinScaleExtentToFitGraph();
    this.setInitialZoom();
  }

  public precomputeAndStart(): void {
    this.forceSimulation.precomputeAndStart(() => this.initialZoomToFit && this.zoomByType(ZoomType.FIT));
  }

  public zoomByType(zoomType: ZoomType): void {}

  public update(options: { updateNodes: boolean; updateRelationships: boolean; restartSimulation: boolean }): void {
    if (options.updateNodes) {
      this.updateNodes();
    }

    if (options.updateRelationships) {
      this.updateRelationships();
    }

    if (options.restartSimulation) {
      this.forceSimulation.restart();
    }

    this.trigger("updated");
  }

  /**
   * Reconfigure and resizing the canvase holding the graph visualization.
   *
   * The reconfiguration overwrites
   *
   * 1. whether or not the resizing becomes a full-screen
   * 2. whether or not a zoom-operation requires a modifier key being pressed simultaneously
   *
   * The resizing repositions the display rectangle area such that it is place at the center (0, 0) of the
   * coordinate system
   *
   * @param isFullScreen a flag indicating whether or not the resizing becomes a full-screen
   * @param wheelZoomRequiresModifierKey whether or not the scroll-zooming requires an accompnying modifier key (such as
   * Control/Command key) being pressed
   */
  public resize(isFullScreen: boolean, wheelZoomRequiresModifierKey: boolean): void {
    const size = this.measureSize();
    this.isFullScreen = isFullScreen;
    this.wheelZoomRequiresModifierKey = wheelZoomRequiresModifierKey;

    this.rect.attr("x", () => -Math.floor(size.width / 2)).attr("y", () => Math.floor(size.height / 2));

    this.root.attr(
      "viewBox",
      [-Math.floor(size.width / 2), -Math.floor(size.height / 2), size.width, size.height].join(" ")
    );
  }

  /**
   * An event dispatcher that, given a specified event name, triggers a list of callbacks attached to the event.
   *
   * The {@link Visualization} maintians a mapping from the event name to the list of callbacks. This mapping can be
   * updated using {@link Visualization.on}
   *
   * @param eventName a event name such as {@link Visualization.CANVAS_CLICKED_EVENT_NAME}
   * @param args the runtime-arguments passed to the executing callbacks. NOTE that these arguments will be applied to
   * all matching callbacks
   */
  public trigger(eventName: string, ...args: any[]): void {
    const callbacksForEvent = this.callbacks[eventName] ?? [];
    callbacksForEvent.forEach((callback) => callback.apply(null, args));
  }

  /**
   * Associates a function with an user event on this {@link Visualization}.
   *
   * @param eventName the provided event name such as {@link Visualization.CANVAS_CLICKED_EVENT_NAME}
   * @param callback the callback function that is to be attached to the event and that is to be executed when the event
   * is called
   *
   * @returns the {@link Visualization} instance on which this function is called for better API chaining
   */
  public on(eventName: string, callback: (...args: any) => void): this {
    const existingCallback = this.callbacks[eventName];

    if (existingCallback === null || existingCallback === undefined) {
      this.callbacks[eventName] = [];
    }

    this.callbacks[eventName]?.push(callback);

    return this;
  }

  private render() {
    return null;
  }

  private updateNodes() {
    this.geometry.onGraphChange(this.graph, { updateNodes: true, updateRelationships: false });
  }

  private updateRelationships() {}

  private adjustZoomMinScaleExtentToFitGraph(padding_factor: number = 0.75): void {}

  private setInitialZoom(): void {}
}
