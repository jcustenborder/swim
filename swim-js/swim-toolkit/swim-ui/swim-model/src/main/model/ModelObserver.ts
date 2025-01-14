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

import type {ComponentObserver} from "@swim/component";
import type {Model} from "./Model";
import type {Trait} from "../trait/Trait";

/** @public */
export interface ModelObserver<M extends Model = Model> extends ComponentObserver<M> {
  modelWillAttachParent?(parent: Model, model: M): void;

  modelDidAttachParent?(parent: Model, model: M): void;

  modelWillDetachParent?(parent: Model, model: M): void;

  modelDidDetachParent?(parent: Model, model: M): void;

  modelWillInsertChild?(child: Model, target: Model | null, model: M): void;

  modelDidInsertChild?(child: Model, target: Model | null, model: M): void;

  modelWillRemoveChild?(child: Model, model: M): void;

  modelDidRemoveChild?(child: Model, model: M): void;

  modelWillReinsertChild?(child: Model, target: Model | null, model: M): void;

  modelDidReinsertChild?(child: Model, target: Model | null, model: M): void;

  modelWillInsertTrait?(trait: Trait, target: Trait | null, model: M): void;

  modelDidInsertTrait?(trait: Trait, target: Trait | null, model: M): void;

  modelWillRemoveTrait?(trait: Trait, model: M): void;

  modelDidRemoveTrait?(trait: Trait, model: M): void;

  modelWillMount?(model: M): void;

  modelDidMount?(model: M): void;

  modelWillUnmount?(model: M): void;

  modelDidUnmount?(model: M): void;

  modelWillMutate?(model: M): void;

  modelDidMutate?(model: M): void;

  modelWillAggregate?(model: M): void;

  modelDidAggregate?(model: M): void;

  modelWillCorrelate?(model: M): void;

  modelDidCorrelate?(model: M): void;

  modelWillValidate?(model: M): void;

  modelDidValidate?(model: M): void;

  modelWillReconcile?(model: M): void;

  modelDidReconcile?(model: M): void;

  modelWillStartConsuming?(model: M): void;

  modelDidStartConsuming?(model: M): void;

  modelWillStopConsuming?(model: M): void;

  modelDidStopConsuming?(model: M): void;
}
