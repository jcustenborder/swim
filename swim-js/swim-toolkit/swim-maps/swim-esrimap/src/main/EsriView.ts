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

import type {Class} from "@swim/util";
import {MapView} from "@swim/map";
import {EsriViewport} from "./EsriViewport";
import type {EsriViewObserver} from "./EsriViewObserver";

/** @public */
export abstract class EsriView extends MapView {
  constructor() {
    super();
    EsriViewport.init();
  }

  override readonly observerType?: Class<EsriViewObserver>;

  abstract readonly map: __esri.View;
}
