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

import {Spec, Unit} from "@swim/unit";
import {LookVectorSpec} from "./LookVectorSpec";
import {FeelVectorSpec} from "./FeelVectorSpec";
import {MoodVectorSpec} from "./MoodVectorSpec";
import {MoodMatrixSpec} from "./MoodMatrixSpec";
import {ThemeMatrixSpec} from "./ThemeMatrixSpec";
import {ThemeAnimatorSpec} from "./ThemeAnimatorSpec";

@Unit
export class ThemeSuite extends Spec {
  @Unit
  lookVectorSpec(): Spec {
    return new LookVectorSpec();
  }

  @Unit
  feelVectorSpac(): Spec {
    return new FeelVectorSpec();
  }

  @Unit
  moodVectorSpec(): Spec {
    return new MoodVectorSpec();
  }

  @Unit
  moodMatrixSpec(): Spec {
    return new MoodMatrixSpec();
  }

  @Unit
  themeMatrixSpec(): Spec {
    return new ThemeMatrixSpec();
  }

  @Unit
  themeAnimatorSpec(): Spec {
    return new ThemeAnimatorSpec();
  }
}
