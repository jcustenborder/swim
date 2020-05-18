// Copyright 2015-2020 SWIM.AI inc.
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

import {Renderer} from "./Renderer";
import {CanvasContext} from "./CanvasContext";

export class CanvasRenderer extends Renderer {
  /** @hidden */
  readonly _context: CanvasContext;
  /** @hidden */
  readonly _pixelRatio: number;

  constructor(context: CanvasContext, pixelRatio: number = window.devicePixelRatio || 1) {
    super();
    this._context = context;
    this._pixelRatio = pixelRatio;
  }

  get context(): CanvasContext {
    return this._context;
  }

  get pixelRatio(): number {
    return this._pixelRatio;
  }
}