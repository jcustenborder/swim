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

import {Spec, Test, Exam} from "@swim/unit";
import {GeoTile} from "@swim/geo";

export class GeoTileSpec extends Spec {
  @Test
  tileBounds(exam: Exam): void {
    const tile = new GeoTile(3, 10, 4);
    exam.equivalent(tile.lngMin, -112.5);
    exam.equivalent(tile.latMin, 40.97989806962013);
    exam.equivalent(tile.lngMax, -90);
    exam.equivalent(tile.latMax, 55.77657301866767);
  }

  @Test
  parentTile(exam: Exam): void {
    const tile = new GeoTile(3, 10, 4);
    exam.equal(tile.parentTile, new GeoTile(1, 5, 3));
  }

  @Test
  childTiles(exam: Exam): void {
    const tile = new GeoTile(3, 10, 4);
    exam.equal(tile.southWestTile, new GeoTile(6, 20, 5));
    exam.equal(tile.northWestTile, new GeoTile(6, 21, 5));
    exam.equal(tile.southEastTile, new GeoTile(7, 20, 5));
    exam.equal(tile.northEastTile, new GeoTile(7, 21, 5));
  }
}
