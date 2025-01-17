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

import {Input, Output, Parser, Diagnostic, Unicode} from "@swim/codec";
import {Transform} from "./Transform";
import {TranslateTransformParser} from "../"; // forward import
import {ScaleTransformParser} from "../"; // forward import
import {RotateTransformParser} from "../"; // forward import
import {SkewTransformParser} from "../"; // forward import
import {AffineTransformParser} from "../"; // forward import

/** @internal */
export class TransformParser extends Parser<Transform> {
  private readonly identOutput: Output<string> | undefined;

  constructor(identOutput?: Output<string>) {
    super();
    this.identOutput = identOutput;
  }

  override feed(input: Input): Parser<Transform> {
    return TransformParser.parse(input, this.identOutput);
  }

  static parse(input: Input, identOutput?: Output<string>): Parser<Transform> {
    let c = 0;
    identOutput = identOutput || Unicode.stringOutput();
    while (input.isCont() && (c = input.head(), Unicode.isAlpha(c) || Unicode.isDigit(c) || c === 45/*'-'*/)) {
      input = input.step();
      identOutput.write(c);
    }
    if (!input.isEmpty()) {
      const ident = identOutput.bind();
      switch (ident) {
        case "translate3d":
        case "translateX":
        case "translateY":
        case "translate": return TranslateTransformParser.parseRest(input, identOutput);
        case "scaleX":
        case "scaleY":
        case "scale": return ScaleTransformParser.parseRest(input, identOutput);
        case "rotate": return RotateTransformParser.parseRest(input, identOutput);
        case "skewX":
        case "skewY":
        case "skew": return SkewTransformParser.parseRest(input, identOutput);
        case "matrix": return AffineTransformParser.parseRest(input, identOutput);
        case "none": return Parser.done(Transform.identity());
        default: return Parser.error(Diagnostic.message("unknown transform function: " + ident, input));
      }
    }
    return new TransformParser(identOutput);
  }
}
