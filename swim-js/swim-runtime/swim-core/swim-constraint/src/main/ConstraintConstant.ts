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

import type {Mutable} from "@swim/util";
import {Output, Debug, Format} from "@swim/codec";
import {ConstraintMap} from "./ConstraintMap";
import {AnyConstraintExpression, ConstraintExpression} from "./ConstraintExpression";
import type {ConstraintTerm} from "./ConstraintTerm";
import type {ConstraintVariable} from "./ConstraintVariable";

/** @public */
export class ConstraintConstant implements ConstraintTerm, Debug {
  constructor(constant: number) {
    this.constant = constant;
  }

  isConstant(): boolean {
    return true;
  }

  get coefficient(): number {
    return 0;
  }

  get variable(): ConstraintVariable | null {
    return null;
  }

  get terms(): ConstraintMap<ConstraintVariable, number> {
    return new ConstraintMap<ConstraintVariable, number>();
  }

  readonly constant: number;

  plus(that: AnyConstraintExpression): ConstraintExpression {
    that = ConstraintExpression.fromAny(that);
    if (that instanceof ConstraintConstant) {
      return ConstraintExpression.constant(this.constant + that.constant);
    } else {
      return ConstraintExpression.sum(this, that);
    }
  }

  negative(): ConstraintTerm {
    return ConstraintExpression.constant(-this.constant);
  }

  minus(that: AnyConstraintExpression): ConstraintExpression {
    that = ConstraintExpression.fromAny(that);
    if (that instanceof ConstraintConstant) {
      return ConstraintExpression.constant(this.constant - that.constant);
    } else {
      return ConstraintExpression.sum(this, that.negative());
    }
  }

  times(scalar: number): ConstraintExpression {
    return ConstraintExpression.constant(this.constant * scalar);
  }

  divide(scalar: number): ConstraintExpression {
    return ConstraintExpression.constant(this.constant / scalar);
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("ConstraintExpression").write(46/*'.'*/);
    if (this.constant === 0) {
      output = output.write("zero");
    } else {
      output = output.write("constant").write(40/*'('*/).debug(this.constant).write(41/*')'*/);
    }
    return output;
  }

  toString(): string {
    return Format.debug(this);
  }
}
(ConstraintExpression as Mutable<typeof ConstraintExpression>).zero = new ConstraintConstant(0);
