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

package swim.math;

import swim.structure.Form;

public abstract class Z2Form<T> extends Form<T> implements Z2Boundary<T> {

  public Z2Form() {
    // nop
  }

  @Override
  public abstract long getXMin(T object);

  @Override
  public abstract long getYMin(T object);

  @Override
  public abstract long getXMax(T object);

  @Override
  public abstract long getYMax(T object);

  @Override
  public abstract boolean contains(T outer, T inner);

  @Override
  public abstract boolean intersects(T s, T t);

  public static <T> R2Form<T> transformed(Z2Form<T> form, Z2ToR2Function function) {
    return new Z2ToR2Form<T>(form, function);
  }

}
