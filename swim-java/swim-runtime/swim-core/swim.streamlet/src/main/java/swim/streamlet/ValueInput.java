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

package swim.streamlet;

public class ValueInput<O> extends AbstractOutlet<O> {

  protected O state;

  public ValueInput(O state) {
    this.state = state;
  }

  public ValueInput() {
    this(null);
  }

  @Override
  public O get() {
    return this.state;
  }

  public O set(O newState) {
    final O oldState = this.state;
    this.state = newState;
    this.decohereInput();
    return oldState;
  }

}
