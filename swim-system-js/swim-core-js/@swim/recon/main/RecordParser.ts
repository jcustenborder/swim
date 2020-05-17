// Copyright 2015-2020 SWIM.AI inc.
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

import {Builder} from "@swim/util";
import {Input, Parser, Diagnostic} from "@swim/codec";
import {Recon} from "./Recon";
import {ReconParser} from "./ReconParser";

/** @hidden */
export class RecordParser<I, V> extends Parser<V> {
  private readonly _recon: ReconParser<I, V>;
  private readonly _builder: Builder<I, V> | undefined;
  private readonly _keyParser: Parser<V> | undefined;
  private readonly _valueParser: Parser<V> | undefined;
  private readonly _step: number | undefined;

  constructor(recon: ReconParser<I, V>, builder?: Builder<I, V>, keyParser?: Parser<V>,
              valueParser?: Parser<V>, step?: number) {
    super();
    this._recon = recon;
    this._builder = builder;
    this._keyParser = keyParser;
    this._valueParser = valueParser;
    this._step = step;
  }

  feed(input: Input): Parser<V> {
    return RecordParser.parse(input, this._recon, this._builder, this._keyParser,
                              this._valueParser, this._step);
  }

  static parse<I, V>(input: Input, recon: ReconParser<I, V>, builder?: Builder<I, V>,
                     keyParser?: Parser<V>, valueParser?: Parser<V>, step: number = 1): Parser<V> {
    let c = 0;
    if (step === 1) {
      if (input.isCont()) {
        c = input.head();
        if (c === 123/*'{'*/) {
          input = input.step();
          step = 2;
        } else {
          return Parser.error(Diagnostic.expected(123/*'{'*/, input));
        }
      } else if (input.isDone()) {
        return Parser.error(Diagnostic.expected(123/*'{'*/, input));
      }
    }
    block: do {
      if (step === 2) {
        while (input.isCont() && (c = input.head(), Recon.isWhitespace(c))) {
          input = input.step();
        }
        if (input.isCont()) {
          builder = builder || recon.recordBuilder();
          if (c === 125/*'}'*/) {
            input = input.step();
            return Parser.done(builder.bind());
          } else if (c === 35/*'#'*/) {
            input = input.step();
            step = 8;
          } else {
            step = 3;
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected(125/*'}'*/, input));
        }
      }
      if (step === 3) {
        if (keyParser === void 0) {
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
      if (step === 4) {
        while (input.isCont() && (c = input.head(), Recon.isSpace(c))) {
          input = input.step();
        }
        if (input.isCont()) {
          if (c === 58/*':'*/) {
            input = input.step();
            step = 5;
          } else {
            builder!.push(recon.item(keyParser!.bind()));
            keyParser = void 0;
            step = 7;
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected(125/*'}'*/, input));
        }
      }
      if (step === 5) {
        while (input.isCont() && Recon.isSpace(input.head())) {
          input = input.step();
        }
        if (input.isCont()) {
          step = 6;
        } else if (input.isDone()) {
          builder!.push(recon.slot(keyParser!.bind()));
          return Parser.done(builder!.bind());
        }
      }
      if (step === 6) {
        if (valueParser === void 0) {
          valueParser = recon.parseBlockExpression(input);
        }
        while (valueParser.isCont() && !input.isEmpty()) {
          valueParser = valueParser.feed(input);
        }
        if (valueParser.isDone()) {
          builder!.push(recon.slot(keyParser!.bind(), valueParser.bind()));
          keyParser = void 0;
          valueParser = void 0;
          step = 7;
        } else if (valueParser.isError()) {
          return valueParser;
        }
      }
      if (step === 7) {
        while (input.isCont() && (c = input.head(), Recon.isSpace(c))) {
          input = input.step();
        }
        if (input.isCont()) {
          if (c === 44/*','*/ || c === 59/*';'*/ || Recon.isNewline(c)) {
            input = input.step();
            step = 2;
            continue;
          } else if (c === 35/*'#'*/) {
            input = input.step();
            step = 8;
          } else if (c === 125/*'}'*/) {
            input = input.step();
            return Parser.done(builder!.bind());
          } else {
            return Parser.error(Diagnostic.expected("'}', ';', ',', or newline", input));
          }
        } else if (input.isDone()) {
          return Parser.error(Diagnostic.expected(125/*'}'*/, input));
        }
      }
      if (step === 8) {
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
    return new RecordParser<I, V>(recon, builder, keyParser, valueParser, step);
  }
}
