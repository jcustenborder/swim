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

import {AttributeAnimatorClass, AttributeAnimator} from "./AttributeAnimator";

/** @internal */
export interface BooleanAttributeAnimator<O = unknown, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const BooleanAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const BooleanAttributeAnimator = _super.extend("BooleanAttributeAnimator", {
    valueType: Boolean,
  }) as AttributeAnimatorClass<BooleanAttributeAnimator<any, any, any>>;

  BooleanAttributeAnimator.prototype.equalValues = function (newValue: boolean | undefined, oldValue: boolean | undefined): boolean {
    return newValue === oldValue;
  };

  BooleanAttributeAnimator.prototype.parse = function (value: string): boolean | undefined {
    return !!value;
  };

  BooleanAttributeAnimator.prototype.fromAny = function (value: boolean | string): boolean | undefined {
    return !!value;
  };

  return BooleanAttributeAnimator;
})(AttributeAnimator);
