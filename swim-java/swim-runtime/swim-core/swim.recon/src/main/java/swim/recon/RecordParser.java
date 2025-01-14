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

package swim.recon;

import swim.codec.Diagnostic;
import swim.codec.Input;
import swim.codec.Parser;
import swim.util.Builder;

final class RecordParser<I, V> extends Parser<V> {

  final ReconParser<I, V> recon;
  final Builder<I, V> builder;
  final Parser<V> keyParser;
  final Parser<V> valueParser;
  final int step;

  RecordParser(ReconParser<I, V> recon, Builder<I, V> builder,
               Parser<V> keyParser, Parser<V> valueParser, int step) {
    this.recon = recon;
    this.builder = builder;
    this.keyParser = keyParser;
    this.valueParser = valueParser;
    this.step = step;
  }

  @Override
  public Parser<V> feed(Input input) {
    return RecordParser.parse(input, this.recon, this.builder, this.keyParser,
                              this.valueParser, this.step);
  }

  static <I, V> Parser<V> parse(Input input, ReconParser<I, V> recon, Builder<I, V> builder,
                                Parser<V> keyParser, Parser<V> valueParser, int step) {
    int c = 0;
    if (step == 1) {
      if (input.isCont()) {
        c = input.head();
        if (c == '{') {
          input = input.step();
          step = 2;
        } else {
          return Parser.error(Diagnostic.expected('{', input));
        }
      } else if (input.isDone()) {
        return Parser.error(Diagnostic.expected('{', input));
      }
    }
    block:
    do {
      if (step == 2) {
        while (input.isCont()) {
          c = input.head();
          if (Recon.isWhitespace(c)) {
            input = input.step();
          } else {
            break;
          }
        }
        if (input.isCont()) {
          if (builder == null) {
            builder = recon.recordBuilder();
          }
          if (c == '}') {
            input = input.step();
            return Parser.done(builder.bind());
          } else if (c == '#') {
            input = input.step();
            step = 8;
          } else {
            step = 3;
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected('}', input));
        }
      }
      if (step == 3) {
        if (keyParser == null) {
          keyParser = recon.parseBlockExpression(input);
        }
        while (keyParser.isCont() && !input.isEmpty()) {
          keyParser = keyParser.feed(input);
        }
        if (keyParser.isDone()) {
          step = 4;
        } else if (keyParser.isError()) {
          return keyParser;
        }
      }
      if (step == 4) {
        while (input.isCont()) {
          c = input.head();
          if (Recon.isSpace(c)) {
            input = input.step();
          } else {
            break;
          }
        }
        if (input.isCont()) {
          if (c == ':') {
            input = input.step();
            step = 5;
          } else {
            builder.add(recon.item(keyParser.bind()));
            keyParser = null;
            step = 7;
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected('}', input));
        }
      }
      if (step == 5) {
        while (input.isCont() && Recon.isSpace(input.head())) {
          input = input.step();
        }
        if (input.isCont()) {
          step = 6;
        } else if (input.isDone()) {
          builder.add(recon.slot(keyParser.bind()));
          return Parser.done(builder.bind());
        }
      }
      if (step == 6) {
        if (valueParser == null) {
          valueParser = recon.parseBlockExpression(input);
        }
        while (valueParser.isCont() && !input.isEmpty()) {
          valueParser = valueParser.feed(input);
        }
        if (valueParser.isDone()) {
          builder.add(recon.slot(keyParser.bind(), valueParser.bind()));
          keyParser = null;
          valueParser = null;
          step = 7;
        } else if (valueParser.isError()) {
          return valueParser;
        }
      }
      if (step == 7) {
        while (input.isCont()) {
          c = input.head();
          if (Recon.isSpace(c)) {
            input = input.step();
          } else {
            break;
          }
        }
        if (input.isCont()) {
          if (c == ',' || c == ';' || Recon.isNewline(c)) {
            input = input.step();
            step = 2;
            continue;
          } else if (c == '#') {
            input = input.step();
            step = 8;
          } else if (c == '}') {
            input = input.step();
            return Parser.done(builder.bind());
          } else {
            return Parser.error(Diagnostic.expected("'}', ';', ',', or newline", input));
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected('}', input));
        }
      }
      if (step == 8) {
        while (input.isCont()) {
          c = input.head();
          if (!Recon.isNewline(c)) {
            input = input.step();
          } else {
            step = 2;
            continue block;
          }
        }
        if (input.isDone()) {
          step = 2;
          continue;
        }
      }
      break;
    } while (true);
    if (input.isError()) {
      return Parser.error(input.trap());
    }
    return new RecordParser<I, V>(recon, builder, keyParser, valueParser, step);
  }

  static <I, V> Parser<V> parse(Input input, ReconParser<I, V> recon, Builder<I, V> builder) {
    return RecordParser.parse(input, recon, builder, null, null, 1);
  }

  static <I, V> Parser<V> parse(Input input, ReconParser<I, V> recon) {
    return RecordParser.parse(input, recon, null, null, null, 1);
  }

}
