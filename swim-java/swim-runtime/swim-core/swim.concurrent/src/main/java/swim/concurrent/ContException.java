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

package swim.concurrent;

/**
 * Thrown when performing an invalid operation on a {@link Call} or {@link
 * Cont}inuation.
 */
public class ContException extends RuntimeException {

  public ContException(String message, Throwable cause) {
    super(message, cause);
  }

  public ContException(String message) {
    super(message);
  }

  public ContException(Throwable cause) {
    super(cause);
  }

  public ContException() {
    super();
  }

  private static final long serialVersionUID = 1L;

}
