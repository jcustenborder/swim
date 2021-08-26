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

import type {Input} from "../input/Input";
import {Parser} from "./Parser";

/** @hidden */
export class ParserDone<O> extends Parser<O> {
  /** @hidden */
  readonly value!: O;

  constructor(value: O) {
    super();
    Object.defineProperty(this, "value", {
      value: value,
      enumerable: true,
    });
  }

  override isCont(): boolean {
    return false;
  }

  override isDone(): boolean {
    return true;
  }

  override feed(input: Input): Parser<O> {
    return this;
  }

  override bind(): O {
    return this.value;
  }
}