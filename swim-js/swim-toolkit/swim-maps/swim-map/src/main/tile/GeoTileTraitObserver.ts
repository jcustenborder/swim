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

import type {GeoLayerTraitObserver} from "../layer/GeoLayerTraitObserver";
import type {GeoTileTrait} from "./GeoTileTrait";

/** @public */
export interface GeoTileTraitObserver<T extends GeoTileTrait = GeoTileTrait> extends GeoLayerTraitObserver<T> {
  traitWillAttachTile?(tileTrait: GeoTileTrait, trait: T): void;

  traitDidDetachTile?(tileTrait: GeoTileTrait, trait: T): void;
}
