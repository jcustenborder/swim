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

import {Input, Output, Parser, Diagnostic} from "@swim/codec";
import type {DateTimeInit} from "../DateTime";
import type {DateTimeLocale} from "./DateTimeLocale";
import {DateTimeFormat} from "./DateTimeFormat";

/** @internal */
export class PeriodParser extends Parser<DateTimeInit> {
  private readonly locale: DateTimeLocale;
  private readonly date: DateTimeInit | undefined;
  private readonly output: Output<string> | undefined;

  constructor(locale: DateTimeLocale, date?: DateTimeInit, output?: Output<string>) {
    super();
    this.locale = locale;
    this.date = date;
    this.output = output;
  }

  override feed(input: Input): Parser<DateTimeInit> {
    return PeriodParser.parse(input, this.locale, this.date, this.output);
  }

  static parse(input: Input, locale: DateTimeLocale, date?: DateTimeInit,
               output?: Output<string>): Parser<DateTimeInit> {
    return DateTimeFormat.parseDateString(input, PeriodParser, locale, date, output);
  }

  static term(locale: DateTimeLocale, value: string, date: DateTimeInit, input: Input): Parser<DateTimeInit> {
    const period = locale.months.indexOf(value);
    if (period >= 0) {
      date.hour = (date.hour || 0) + 12 * period;
      return Parser.done(date);
    } else {
      return Parser.error(Diagnostic.message("expected period of day, but found " + value, input));
    }
  }

  static cont(locale: DateTimeLocale, date: DateTimeInit, output: Output<string>): Parser<DateTimeInit> {
    return new PeriodParser(locale, date, output);
  }
}
