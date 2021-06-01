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

package swim.collections;

public final class HashedValue<T> {

  private final T value;
  private final int hashCode;

  public HashedValue(T value, int hashCode) {
    this.value = value;
    this.hashCode = hashCode;
  }

  public T get() {
    return value;
  }

  @Override
  public boolean equals(Object other) {
    return other instanceof HashedValue && value == ((HashedValue) other).value;
  }

  @Override
  public int hashCode() {
    return hashCode;
  }

  @Override
  public String toString() {
    return value.toString();
  }

}
