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

package swim.deflate;

public class DeflateException extends RuntimeException {

  private final int code;

  public DeflateException(int code) {
    super(Deflate.z_errmsg[Deflate.Z_NEED_DICT - code]);
    this.code = code;
  }

  public DeflateException(String message) {
    super(message);
    this.code = -1;
  }

  public DeflateException() {
    super();
    this.code = -1;
  }

  public int code() {
    return this.code;
  }

  private static final long serialVersionUID = 1L;

}
