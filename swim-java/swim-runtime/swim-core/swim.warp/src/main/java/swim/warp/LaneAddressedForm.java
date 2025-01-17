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

package swim.warp;

import swim.structure.Attr;
import swim.structure.Form;
import swim.structure.Item;
import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;

abstract class LaneAddressedForm<E extends LaneAddressed> extends Form<E> {

  abstract E create(Uri nodeUri, Uri lane, Value body);

  @Override
  public E unit() {
    return null;
  }

  @Override
  public Item mold(E envelope) {
    if (envelope != null) {
      final Record headers = Record.create(2).slot("node", envelope.nodeUri.toString())
                                             .slot("lane", envelope.laneUri.toString());
      return Attr.of(this.tag(), headers).concat(envelope.body());
    } else {
      return Item.extant();
    }
  }

  @Override
  public E cast(Item item) {
    final Value value = item.toValue();
    final Record headers = value.headers(this.tag());
    Uri nodeUri = null;
    Uri laneUri = null;
    for (int i = 0, n = headers.size(); i < n; i += 1) {
      final Item header = headers.get(i);
      final String key = header.key().stringValue(null);
      if (key != null) {
        if ("node".equals(key)) {
          nodeUri = Uri.parse(header.toValue().stringValue(""));
        } else if ("lane".equals(key)) {
          laneUri = Uri.parse(header.toValue().stringValue(""));
        }
      } else if (header instanceof Value) {
        if (i == 0) {
          nodeUri = Uri.parse(header.stringValue(""));
        } else if (i == 1) {
          laneUri = Uri.parse(header.stringValue(""));
        }
      }
    }
    if (nodeUri != null && laneUri != null) {
      final Value body = value.body();
      return this.create(nodeUri, laneUri, body);
    }
    return null;
  }

}
