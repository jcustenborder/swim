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

package swim.mqtt;

import swim.codec.Encoder;
import swim.codec.EncoderException;
import swim.codec.OutputBuffer;

final class MqttDisconnectPacketEncoder extends Encoder<Object, MqttDisconnectPacket> {

  final MqttEncoder mqtt;
  final MqttDisconnectPacket packet;
  final int length;
  final int remaining;
  final int step;

  MqttDisconnectPacketEncoder(MqttEncoder mqtt, MqttDisconnectPacket packet,
                              int length, int remaining, int step) {
    this.mqtt = mqtt;
    this.packet = packet;
    this.length = length;
    this.remaining = remaining;
    this.step = step;
  }

  MqttDisconnectPacketEncoder(MqttEncoder mqtt, MqttDisconnectPacket packet) {
    this(mqtt, packet, 0, 0, 1);
  }

  @Override
  public Encoder<Object, MqttDisconnectPacket> pull(OutputBuffer<?> output) {
    return MqttDisconnectPacketEncoder.encode(output, this.mqtt, this.packet,
                                              this.length, this.remaining, this.step);
  }

  static Encoder<Object, MqttDisconnectPacket> encode(OutputBuffer<?> output, MqttEncoder mqtt,
                                                      MqttDisconnectPacket packet, int length,
                                                      int remaining, int step) {
    if (step == 1 && output.isCont()) {
      length = packet.variableHeaderSize(mqtt);
      remaining = length;
      output = output.write(packet.packetType() << 4 | packet.packetFlags & 0x0f);
      step = 2;
    }
    while (step >= 2 && step <= 5 && output.isCont()) {
      int b = length & 0x7f;
      length = length >>> 7;
      if (length > 0) {
        b |= 0x80;
      }
      output = output.write(b);
      if (length == 0) {
        step = 6;
        break;
      } else if (step < 5) {
        step += 1;
      } else {
        return Encoder.error(new MqttException("packet length too long: " + remaining));
      }
    }
    if (step == 6 && remaining == 0) {
      return Encoder.done(packet);
    }
    if (remaining < 0) {
      return Encoder.error(new MqttException("packet length too short"));
    } else if (output.isDone()) {
      return Encoder.error(new EncoderException("truncated"));
    } else if (output.isError()) {
      return Encoder.error(output.trap());
    }
    return new MqttDisconnectPacketEncoder(mqtt, packet, length, remaining, step);
  }

  static Encoder<Object, MqttDisconnectPacket> encode(OutputBuffer<?> output, MqttEncoder mqtt,
                                                      MqttDisconnectPacket packet) {
    return MqttDisconnectPacketEncoder.encode(output, mqtt, packet, 0, 0, 1);
  }

}
