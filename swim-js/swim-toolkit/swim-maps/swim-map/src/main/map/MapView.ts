// Copyright 2015-2023 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type {Class, AnyTiming} from "@swim/util";
import {FastenerClass, Property} from "@swim/component";
import type {GeoBox} from "@swim/geo";
import {ViewFlags, View, ViewRef} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {CanvasView} from "@swim/graphics";
import type {AnyGeoPerspective} from "../geo/GeoPerspective";
import type {GeoViewport} from "../geo/GeoViewport";
import {GeoView} from "../geo/GeoView";
import type {MapViewObserver} from "./MapViewObserver";

/** @public */
export abstract class MapView extends GeoView {
  override readonly observerType?: Class<MapViewObserver>;

  @Property<MapView["geoViewport"]>({
    extends: true,
    inherits: false,
  })
  override readonly geoViewport!: Property<this, GeoViewport> & GeoView["geoViewport"];

  abstract moveTo(geoPerspective: AnyGeoPerspective, timing?: AnyTiming | boolean): void;

  @ViewRef<MapView["canvas"]>({
    viewType: CanvasView,
    willAttachView(canvasView: CanvasView): void {
      this.owner.callObservers("viewWillAttachMapCanvas", canvasView, this.owner);
    },
    didDetachView(canvasView: CanvasView): void {
      this.owner.callObservers("viewDidDetachMapCanvas", canvasView, this.owner);
    },
  })
  readonly canvas!: ViewRef<this, CanvasView>;
  static readonly canvas: FastenerClass<MapView["canvas"]>;

  @ViewRef<MapView["container"]>({
    viewType: HtmlView,
    willAttachView(containerView: HtmlView): void {
      this.owner.callObservers("viewWillAttachMapContainer", containerView, this.owner);
    },
    didDetachView(containerView: HtmlView): void {
      this.owner.callObservers("viewDidDetachMapContainer", containerView, this.owner);
    },
  })
  readonly container!: ViewRef<this, HtmlView>;
  static readonly container: FastenerClass<MapView["container"]>;

  protected override needsProcess(processFlags: ViewFlags): ViewFlags {
    if ((processFlags & View.NeedsResize) !== 0) {
      processFlags |= View.NeedsProject;
    }
    return processFlags;
  }

  override get geoFrame(): GeoBox {
    return this.geoViewport.value.geoFrame;
  }
}
