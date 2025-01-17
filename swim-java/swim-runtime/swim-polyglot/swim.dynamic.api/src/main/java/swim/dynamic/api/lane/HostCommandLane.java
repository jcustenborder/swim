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

package swim.dynamic.api.lane;

import swim.api.lane.CommandLane;
import swim.dynamic.Bridge;
import swim.dynamic.HostMethod;
import swim.dynamic.HostObjectType;
import swim.dynamic.JavaHostObjectType;
import swim.dynamic.api.warp.HostWarpLane;
import swim.dynamic.api.warp.function.GuestOnCommand;

public final class HostCommandLane {

  private HostCommandLane() {
    // static
  }

  public static final HostObjectType<CommandLane<Object>> TYPE;

  static {
    final JavaHostObjectType<CommandLane<Object>> type = new JavaHostObjectType<>(CommandLane.class);
    TYPE = type;
    type.inheritType(HostWarpLane.TYPE);
    type.addMember(new HostCommandLaneObserve());
    type.addMember(new HostCommandLaneUnobserve());
    type.addMember(new HostCommandLaneOnCommand());
  }

}

final class HostCommandLaneObserve implements HostMethod<CommandLane<Object>> {

  @Override
  public String key() {
    return "observe";
  }

  @Override
  public Object invoke(Bridge bridge, CommandLane<Object> lane, Object... arguments) {
    final Object observer = arguments[0];
    // TODO: bridge observer callback members.
    lane.observe(observer);
    return this;
  }

}

final class HostCommandLaneUnobserve implements HostMethod<CommandLane<Object>> {

  @Override
  public String key() {
    return "unobserve";
  }

  @Override
  public Object invoke(Bridge bridge, CommandLane<Object> lane, Object... arguments) {
    final Object observer = arguments[0];
    // TODO: bridge observer callback members.
    lane.unobserve(observer);
    return this;
  }

}

final class HostCommandLaneOnCommand implements HostMethod<CommandLane<Object>> {

  @Override
  public String key() {
    return "onCommand";
  }

  @Override
  public Object invoke(Bridge bridge, CommandLane<Object> lane, Object... arguments) {
    return lane.onCommand(new GuestOnCommand<Object>(bridge, arguments[0]));
  }

}
