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
import {AffineTransform} from "./AffineTransform";

/** @internal */
export const AffineTransformInterpolator = (function (_super: typeof Interpolator) {
  const AffineTransformInterpolator = function (f0: AffineTransform, f1: AffineTransform): Interpolator<AffineTransform> {
    const interpolator = function (u: number): AffineTransform {
      // TODO: interpolate and recompose matrices
      const f0 = interpolator[0];
      const f1 = interpolator[1];
      const x0 = f0.x0 + u * (f1.x0 - f0.x0);
      const y0 = f0.y0 + u * (f1.y0 - f0.y0);
      const x1 = f0.x1 + u * (f1.x1 - f0.x1);
      const y1 = f0.y1 + u * (f1.y1 - f0.y1);
      const tx = f0.tx + u * (f1.tx - f0.tx);
      const ty = f0.ty + u * (f1.ty - f0.ty);
      return new AffineTransform(x0, y0, x1, y1, tx, ty);
    } as Interpolator<AffineTransform>;
    Object.setPrototypeOf(interpolator, AffineTransformInterpolator.prototype);
    // TODO: decompose matrices
    (interpolator as Mutable<typeof interpolator>)[0] = f0;
    (interpolator as Mutable<typeof interpolator>)[1] = f1;
    return interpolator;
  } as {
    (f0: AffineTransform, f1: AffineTransform): Interpolator<AffineTransform>;

    /** @internal */
    prototype: Interpolator<AffineTransform>;
  };

  AffineTransformInterpolator.prototype = Object.create(_super.prototype);
  AffineTransformInterpolator.prototype.constructor = AffineTransformInterpolator;

  return AffineTransformInterpolator;
})(Interpolator);
