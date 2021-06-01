// Copyright 2015-2021 Swim inc.
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

package swim.structure.operator;

import swim.codec.Output;
import swim.structure.Interpreter;
import swim.structure.Item;
import swim.structure.Operator;
import swim.util.Murmur3;

/**
 * A {@link BinaryOperator} that represents an inequality comparison between
 * its two operands.
 */
public final class NeOperator extends BinaryOperator {

  private static int hashSeed;

  public NeOperator(Item operand1, Item operand2) {
    super(operand1, operand2);
  }

  @Override
  public String operator() {
    return "!=";
  }

  @Override
  public int precedence() {
    return 0;
  }

  @Override
  public Item evaluate(Interpreter interpreter) {
    interpreter.willOperate(this);
    final Item argument1 = this.operand1.evaluate(interpreter);
    final Item argument2 = this.operand2.evaluate(interpreter);
    final Item result = argument1.ne(argument2);
    interpreter.didOperate(this, result);
    return result;
  }

  @Override
  public int typeOrder() {
    return 29;
  }

  @Override
  protected int compareTo(Operator that) {
    if (that instanceof NeOperator) {
      return compareTo((NeOperator) that);
    }
    return Integer.compare(typeOrder(), that.typeOrder());
  }

  int compareTo(NeOperator that) {
    int order = this.operand1.compareTo(that.operand1);
    if (order == 0) {
      order = this.operand2.compareTo(that.operand2);
    }
    return order;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    } else if (other instanceof NeOperator) {
      final NeOperator that = (NeOperator) other;
      return this.operand1.equals(that.operand1) && this.operand2.equals(that.operand2);
    }
    return false;
  }

  @Override
  public int hashCode() {
    if (hashSeed == 0) {
      hashSeed = Murmur3.seed(NeOperator.class);
    }
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(hashSeed,
        this.operand1.hashCode()), this.operand2.hashCode()));
  }

  @Override
  public void debug(Output<?> output) {
    output.debug(this.operand1).write('.').write("ne").write('(').debug(this.operand2).write(')');
  }

}
