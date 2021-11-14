// Copyright 2015-2021 Swim Inc.
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

import type {ServiceObserver} from "@swim/util";
import type {ViewportIdiom} from "./ViewportIdiom";
import type {Viewport} from "./Viewport";
import type {ViewportService} from "./ViewportService";
import type {View} from "../view/View";

/** @public */
export interface ViewportServiceObserver<V extends View = View, S extends ViewportService<V> = ViewportService<V>> extends ServiceObserver<V, S> {
  detectViewportIdiom?(viewport: Viewport, service: S): void | ViewportIdiom;

  serviceWillSetViewportIdiom?(newViewportIdiom: ViewportIdiom, oldViewportIdiom: ViewportIdiom, service: S): void;

  serviceDidSetViewportIdiom?(newViewportIdiom: ViewportIdiom, oldViewportIdiom: ViewportIdiom, service: S): void;

  serviceWillReorient?(orientation: OrientationType, service: S): void;

  serviceDidReorient?(orientation: OrientationType, service: S): void;
}
