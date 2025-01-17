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

package swim.vm;

import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyExecutable;
import swim.dynamic.HostStaticMethod;

public class VmHostStaticMethod implements ProxyExecutable {

  final VmBridge bridge;
  final HostStaticMethod staticMethod;

  public VmHostStaticMethod(VmBridge bridge, HostStaticMethod staticMethod) {
    this.bridge = bridge;
    this.staticMethod = staticMethod;
  }

  @Override
  public Object execute(Value... guestArguments) {
    final int arity = guestArguments.length;
    final Object[] hostArguments = new Object[arity];
    for (int i = 0; i < arity; i += 1) {
      hostArguments[i] = this.bridge.guestToHost(guestArguments[i]);
    }
    final Object hostResult = this.staticMethod.invoke(this.bridge, hostArguments);
    final Object guestResult = this.bridge.hostToGuest(hostResult);
    return guestResult;
  }

}
