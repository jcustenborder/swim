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

import {Mutable, Interpolator} from "@swim/util";
import type {Item} from "./Item";
import {Record} from "./Record";

/** @internal */
export interface RecordInterpolator extends Interpolator<Record> {
  /** @internal */
  readonly interpolators: ReadonlyArray<Interpolator<Item>>;

  readonly 0: Record;

  readonly 1: Record;

  equals(that: unknown): boolean;
}

/** @internal */
export const RecordInterpolator = (function (_super: typeof Interpolator) {
  const RecordInterpolator = function (y0: Record, y1: Record): RecordInterpolator {
    const interpolator = function (u: number): Record {
      const interpolators = interpolator.interpolators;
      const interpolatorCount = interpolators.length;
      const record = Record.create(interpolatorCount);
      for (let i = 0; i < interpolatorCount; i += 1) {
        record.push(interpolators[i]!(u));
      }
      return record;
    } as RecordInterpolator;
    Object.setPrototypeOf(interpolator, RecordInterpolator.prototype);
    const interpolatorCount = Math.min(y0.length, y1.length);
    const interpolators = new Array<Interpolator<Item>>(interpolatorCount);
    for (let i = 0; i < interpolatorCount; i += 1) {
      interpolators[i] = y0.getItem(i)!.interpolateTo(y1.getItem(i)!);
    }
    (interpolator as Mutable<typeof interpolator>).interpolators = interpolators;
    return interpolator;
  } as {
    (y0: Record, y1: Record): RecordInterpolator;

    /** @internal */
    prototype: RecordInterpolator;
  };

  RecordInterpolator.prototype = Object.create(_super.prototype);
  RecordInterpolator.prototype.constructor = RecordInterpolator;

  Object.defineProperty(RecordInterpolator.prototype, 0, {
    get(this: RecordInterpolator): Record {
      const interpolators = this.interpolators;
      const interpolatorCount = interpolators.length;
      const record = Record.create(interpolatorCount);
      for (let i = 0; i < interpolatorCount; i += 1) {
        record.push(interpolators[i]![0]);
      }
      return record;
    },
    configurable: true,
  });

  Object.defineProperty(RecordInterpolator.prototype, 1, {
    get(this: RecordInterpolator): Record {
      const interpolators = this.interpolators;
      const interpolatorCount = interpolators.length;
      const record = Record.create(interpolatorCount);
      for (let i = 0; i < interpolatorCount; i += 1) {
        record.push(interpolators[i]![1]);
      }
      return record;
    },
    configurable: true,
  });

  RecordInterpolator.prototype.equals = function (that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof RecordInterpolator) {
      const n = this.interpolators.length;
      if (n === that.interpolators.length) {
        for (let i = 0; i < n; i += 1) {
          if (!this.interpolators[i]!.equals(that.interpolators[i]!)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  };

  return RecordInterpolator;
})(Interpolator);
