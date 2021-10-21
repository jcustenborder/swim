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

import {AnyTransform, Transform} from "@swim/math";
import {AttributeAnimatorClass, AttributeAnimator} from "./AttributeAnimator";

/** @internal */
export const TransformAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const TransformAttributeAnimator = _super.extend() as AttributeAnimatorClass<AttributeAnimator<any, Transform | null, AnyTransform | null>>;

  TransformAttributeAnimator.prototype.parse = function (value: string): Transform | null {
    return Transform.parse(value);
  };

  TransformAttributeAnimator.prototype.fromAny = function (value: AnyTransform): Transform | null {
    try {
      return Transform.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  TransformAttributeAnimator.prototype.equalState = function (newState: Transform | null, oldState: Transform | null): boolean {
    if (newState !== void 0 && newState !== null) {
      return newState.equals(oldState);
    } else {
      return newState === oldState;
    }
  };

  return TransformAttributeAnimator;
})(AttributeAnimator);