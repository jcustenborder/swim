// Copyright 2015-2019 SWIM.AI inc.
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

package swim.structure;

import swim.codec.Output;
import swim.codec.OutputSettings;

final class TextOutput extends Output<Text> {
  final StringBuilder builder;
  OutputSettings settings;

  TextOutput(StringBuilder builder, OutputSettings settings) {
    this.builder = builder;
    this.settings = settings;
  }

  @Override
  public boolean isCont() {
    return true;
  }

  @Override
  public boolean isFull() {
    return false;
  }

  @Override
  public boolean isDone() {
    return false;
  }

  @Override
  public boolean isError() {
    return false;
  }

  @Override
  public boolean isPart() {
    return false;
  }

  @Override
  public Output<Text> isPart(boolean isPart) {
    return this;
  }

  @Override
  public Output<Text> write(int codePoint) {
    this.builder.appendCodePoint(codePoint);
    return this;
  }

  @Override
  public Output<Text> write(String string) {
    this.builder.append(string);
    return this;
  }

  @Override
  public Output<Text> writeln(String string) {
    this.builder.append(string).append(this.settings.lineSeparator());
    return this;
  }

  @Override
  public Output<Text> writeln() {
    this.builder.append(this.settings.lineSeparator());
    return this;
  }

  @Override
  public OutputSettings settings() {
    return this.settings;
  }

  @Override
  public Output<Text> settings(OutputSettings settings) {
    this.settings = settings;
    return this;
  }

  @Override
  public Text bind() {
    return Text.from(this.builder.toString());
  }

  @Override
  public Output<Text> clone() {
    return new TextOutput(new StringBuilder(this.builder.toString()), this.settings);
  }

  @Override
  public String toString() {
    return this.builder.toString();
  }
}