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

import {Item, Text, Form} from "@swim/structure";
import {AngleUnits, AnyAngle, Angle} from "./Angle";

/** @internal */
export class AngleForm extends Form<Angle, AnyAngle> {
  constructor(defaultUnits: AngleUnits | undefined, unit: Angle | undefined) {
    super();
    this.defaultUnits = defaultUnits;
    Object.defineProperty(this, "unit", {
      value: unit,
      enumerable: true,
    });
  }

  readonly defaultUnits: AngleUnits | undefined;

  override readonly unit!: Angle | undefined;

  override withUnit(unit: Angle | undefined): Form<Angle, AnyAngle> {
    if (unit !== this.unit) {
      return new AngleForm(this.defaultUnits, unit);
    } else {
      return this;
    }
  }

  override mold(angle: AnyAngle): Item {
    angle = Angle.fromAny(angle, this.defaultUnits);
    return Text.from(angle.toString());
  }

  override cast(item: Item): Angle | undefined {
    const value = item.toValue();
    let angle: Angle | null = null;
    try {
      angle = Angle.fromValue(value);
      if (angle === void 0) {
        const string = value.stringValue(void 0);
        if (string !== void 0) {
          angle = Angle.parse(string, this.defaultUnits);
        }
      }
    } catch (e) {
      // swallow
    }
    return angle !== null ? angle : void 0;
  }
}
