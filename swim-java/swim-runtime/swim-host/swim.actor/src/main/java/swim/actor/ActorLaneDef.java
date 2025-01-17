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

package swim.actor;

import swim.codec.Debug;
import swim.codec.Format;
import swim.codec.Output;
import swim.concurrent.StageDef;
import swim.store.StoreDef;
import swim.system.LaneDef;
import swim.system.LogDef;
import swim.system.PolicyDef;
import swim.uri.Uri;
import swim.uri.UriPattern;
import swim.util.Murmur3;

public class ActorLaneDef implements LaneDef, Debug {

  final UriPattern lanePattern;
  final String laneType;
  final LogDef logDef;
  final PolicyDef policyDef;
  final StageDef stageDef;
  final StoreDef storeDef;

  public ActorLaneDef(UriPattern lanePattern, String laneType, LogDef logDef,
                      PolicyDef policyDef, StageDef stageDef, StoreDef storeDef) {
    this.lanePattern = lanePattern;
    this.laneType = laneType;
    this.logDef = logDef;
    this.policyDef = policyDef;
    this.stageDef = stageDef;
    this.storeDef = storeDef;
  }

  @Override
  public final Uri laneUri() {
    return this.lanePattern.isUri() ? this.lanePattern.toUri() : null;
  }

  @Override
  public final UriPattern lanePattern() {
    return this.lanePattern;
  }

  public ActorLaneDef lanePattern(UriPattern lanePattern) {
    return this.copy(lanePattern, this.laneType, this.logDef, this.policyDef, this.stageDef, this.storeDef);
  }

  @Override
  public final String laneType() {
    return this.laneType;
  }

  public ActorLaneDef laneType(String laneType) {
    return this.copy(this.lanePattern, laneType, this.logDef, this.policyDef, this.stageDef, this.storeDef);
  }

  @Override
  public final LogDef logDef() {
    return this.logDef;
  }

  public ActorLaneDef logDef(LogDef logDef) {
    return this.copy(this.lanePattern, this.laneType, logDef, this.policyDef, this.stageDef, this.storeDef);
  }

  @Override
  public final PolicyDef policyDef() {
    return this.policyDef;
  }

  public ActorLaneDef policyDef(PolicyDef policyDef) {
    return this.copy(this.lanePattern, this.laneType, this.logDef, policyDef, this.stageDef, this.storeDef);
  }

  @Override
  public final StageDef stageDef() {
    return this.stageDef;
  }

  public ActorLaneDef stageDef(StageDef stageDef) {
    return this.copy(this.lanePattern, this.laneType, this.logDef, this.policyDef, stageDef, this.storeDef);
  }

  @Override
  public final StoreDef storeDef() {
    return this.storeDef;
  }

  public ActorLaneDef storeDef(StoreDef storeDef) {
    return this.copy(this.lanePattern, this.laneType, this.logDef, this.policyDef, this.stageDef, storeDef);
  }

  protected ActorLaneDef copy(UriPattern lanePattern, String laneType, LogDef logDef,
                              PolicyDef policyDef, StageDef stageDef, StoreDef storeDef) {
    return new ActorLaneDef(lanePattern, laneType, logDef, policyDef, stageDef, storeDef);
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    } else if (other instanceof ActorLaneDef) {
      final ActorLaneDef that = (ActorLaneDef) other;
      return this.lanePattern.equals(that.lanePattern)
          && (this.laneType == null ? that.laneType == null : this.laneType.equals(that.laneType))
          && (this.logDef == null ? that.logDef == null : this.logDef.equals(that.logDef))
          && (this.policyDef == null ? that.policyDef == null : this.policyDef.equals(that.policyDef))
          && (this.stageDef == null ? that.stageDef == null : this.stageDef.equals(that.stageDef))
          && (this.storeDef == null ? that.storeDef == null : this.storeDef.equals(that.storeDef));
    }
    return false;
  }

  private static int hashSeed;

  @Override
  public int hashCode() {
    if (ActorLaneDef.hashSeed == 0) {
      ActorLaneDef.hashSeed = Murmur3.seed(ActorLaneDef.class);
    }
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(
        ActorLaneDef.hashSeed, this.lanePattern.hashCode()), Murmur3.hash(this.laneType)),
        Murmur3.hash(this.logDef)), Murmur3.hash(this.policyDef)),
        Murmur3.hash(this.stageDef)), Murmur3.hash(this.storeDef)));
  }

  @Override
  public <T> Output<T> debug(Output<T> output) {
    output = output.write("ActorLaneDef").write('.');
    if (this.lanePattern.isUri()) {
      output = output.write("fromLaneUri").write('(').debug(this.lanePattern.toUri()).write(')');
    } else {
      output = output.write("fromLanePattern").write('(').debug(this.lanePattern).write(')');
    }
    if (this.laneType != null) {
      output = output.write('.').write("laneType").write('(').debug(this.laneType).write(')');
    }
    if (this.logDef != null) {
      output = output.write('.').write("logDef").write('(').debug(this.logDef).write(')');
    }
    if (this.policyDef != null) {
      output = output.write('.').write("policyDef").write('(').debug(this.policyDef).write(')');
    }
    if (this.stageDef != null) {
      output = output.write('.').write("stageDef").write('(').debug(this.stageDef).write(')');
    }
    if (this.storeDef != null) {
      output = output.write('.').write("storeDef").write('(').debug(this.storeDef).write(')');
    }
    return output;
  }

  @Override
  public String toString() {
    return Format.debug(this);
  }

  public static ActorLaneDef fromLaneUri(Uri laneUri) {
    return new ActorLaneDef(UriPattern.from(laneUri), null, null, null, null, null);
  }

  public static ActorLaneDef fromLaneUri(String laneUri) {
    return ActorLaneDef.fromLaneUri(Uri.parse(laneUri));
  }

  public static ActorLaneDef fromLanePattern(UriPattern lanePattern) {
    return new ActorLaneDef(lanePattern, null, null, null, null, null);
  }

  public static ActorLaneDef fromLanePattern(String lanePattern) {
    return ActorLaneDef.fromLanePattern(UriPattern.parse(lanePattern));
  }

}
