// Copyright 2015-2021 Swim Inc.
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

/**
 * WebSocket protocol for dynamically multiplexing large numbers of
 * bidirectional links to streaming API endpoints, called lanes, of
 * URI-addressed distributed objects, called nodes, that run stateful
 * distributed processes, called Web Agents.
 */
module swim.warp {
  requires swim.util;
  requires transitive swim.codec;
  requires transitive swim.uri;
  requires transitive swim.structure;
  requires swim.recon;

  exports swim.warp;
}