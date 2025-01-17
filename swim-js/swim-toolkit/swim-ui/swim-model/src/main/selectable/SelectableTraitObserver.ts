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

import type {SelectionOptions} from "../selection/SelectionService";
import type {TraitObserver} from "../trait/TraitObserver";
import type {SelectableTrait} from "./SelectableTrait";

/** @public */
export interface SelectableTraitObserver<T extends SelectableTrait = SelectableTrait> extends TraitObserver<T> {
  traitWillSelect?(options: SelectionOptions | null, trait: T): void;

  traitDidSelect?(options: SelectionOptions | null, trait: T): void;

  traitWillUnselect?(trait: T): void;

  traitDidUnselect?(trait: T): void;
}
