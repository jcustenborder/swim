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

import type {GraphicsView, GraphicsViewObserver} from "@swim/graphics";
import type {TickView} from "./TickView";

/** @public */
export interface TickViewObserver<D = unknown, V extends TickView<D> = TickView<D>> extends GraphicsViewObserver<V> {
  viewWillAttachTickLabel?(labelView: GraphicsView, view: V): void;

  viewDidDetachTickLabel?(labelView: GraphicsView, view: V): void;
}
