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

import type {Input, Output, Parser} from "@swim/codec";
import type {DateTimeInit, DateTime} from "../DateTime";
import type {DateTimeLocale} from "./DateTimeLocale";
import {DateTimeFormat} from "./DateTimeFormat";
import {MonthParser} from "../"; // forward import

/** @internal */
export class MonthFormat extends DateTimeFormat {
  private readonly locale: DateTimeLocale;

  constructor(locale: DateTimeLocale) {
    super();
    this.locale = locale;
  }

  override withLocale(locale: DateTimeLocale): DateTimeFormat {
    if (locale !== this.locale) {
      return new MonthFormat(locale);
    } else {
      return this;
    }
  }

  override writeDate<T>(output: Output<T>, date: DateTime): Output<T> {
    output = output.write(this.locale.months[date.month]!);
    return output;
  }

  override parseDateTime(input: Input, date: DateTimeInit): Parser<DateTimeInit> {
    return MonthParser.parse(input, this.locale, date);
  }
}
