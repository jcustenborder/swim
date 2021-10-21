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

export type CreateType<C> =
  C extends {create(...args: any[]): infer T} ? T : never;

export interface Creatable<T> {
  create(): T;
}

/** @internal */
export const Creatable = (function () {
  const Creatable = {} as {
    /** @internal */
    is<T>(object: unknown): object is Creatable<T>;
  };

  Creatable.is = function <T>(object: unknown): object is Creatable<T> {
    if (typeof object === "object" && object !== null || typeof object === "function") {
      const creatable = object as Creatable<T>;
      return "create" in creatable;
    }
    return false;
  };

  return Creatable;
})();