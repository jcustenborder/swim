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

package swim.xml;

import swim.codec.Output;
import swim.codec.OutputSettings;

final class PIOutput<I> extends Output<I> {

  final XmlParser<I, ?> xml;
  final String target;
  final StringBuilder builder;
  OutputSettings settings;

  PIOutput(XmlParser<I, ?> xml, String target, StringBuilder builder, OutputSettings settings) {
    this.xml = xml;
    this.target = target;
    this.builder = builder;
    this.settings = settings;
  }

  PIOutput(XmlParser<I, ?> xml, String target) {
    this(xml, target, new StringBuilder(), OutputSettings.standard());
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
  public Output<I> isPart(boolean isPart) {
    return this;
  }

  @Override
  public Output<I> write(int codePoint) {
    this.builder.appendCodePoint(codePoint);
    return this;
  }

  @Override
  public Output<I> write(String string) {
    this.builder.append(string);
    return this;
  }

  @Override
  public Output<I> writeln(String string) {
    this.builder.append(string).append(this.settings.lineSeparator());
    return this;
  }

  @Override
  public Output<I> writeln() {
    this.builder.append(this.settings.lineSeparator());
    return this;
  }

  @Override
  public OutputSettings settings() {
    return this.settings;
  }

  @Override
  public Output<I> settings(OutputSettings settings) {
    this.settings = settings;
    return this;
  }

  @Override
  public I bind() {
    return this.xml.pi(this.target, this.builder.toString());
  }

  @Override
  public Output<I> clone() {
    return new PIOutput<I>(this.xml, this.target, new StringBuilder(this.builder.toString()), this.settings);
  }

  @Override
  public String toString() {
    return this.builder.toString();
  }

}
