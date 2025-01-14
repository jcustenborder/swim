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
import {DateTime} from "../DateTime";
import {TimeDomain} from "./TimeDomain";

/** @internal */
export const TimeDomainInterpolator = (function (_super: typeof Interpolator) {
  const TimeDomainInterpolator = function (x0: TimeDomain, x1: TimeDomain): Interpolator<TimeDomain> {
    const interpolator = function (u: number): TimeDomain {
      const x0 = interpolator[0];
      const x00 = x0[0];
      const x01 = x0[1];
      const x1 = interpolator[1];
      const x10 = x1[0];
      const x11 = x1[1];
      return TimeDomain(new DateTime(x00.time + u * (x10.time - x00.time), u === 0 ? x00.zone : x10.zone),
                        new DateTime(x01.time + u * (x11.time - x01.time), u === 0 ? x01.zone : x11.zone));
    } as Interpolator<TimeDomain>;
    Object.setPrototypeOf(interpolator, TimeDomainInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = x0;
    (interpolator as Mutable<typeof interpolator>)[1] = x1;
    return interpolator;
  } as {
    (x0: TimeDomain, x1: TimeDomain): Interpolator<TimeDomain>;

    /** @internal */
    prototype: Interpolator<TimeDomain>;
  };

  TimeDomainInterpolator.prototype = Object.create(_super.prototype);
  TimeDomainInterpolator.prototype.constructor = TimeDomainInterpolator;

  return TimeDomainInterpolator;
})(Interpolator);
