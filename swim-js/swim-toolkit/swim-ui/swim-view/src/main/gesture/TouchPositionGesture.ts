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

import type {FastenerOwner} from "@swim/component";
import type {View} from "../view/View";
import type {PositionGestureInput} from "./PositionGestureInput";
import {PositionGestureClass, PositionGesture} from "./PositionGesture";

/** @internal */
export interface TouchPositionGesture<O = unknown, V extends View = View> extends PositionGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: PositionGestureInput, event: TouchEvent, touch: Touch): void;

  /** @internal @protected */
  onTouchStart(event: TouchEvent): void;

  /** @internal @protected */
  onTouchMove(event: TouchEvent): void;

  /** @internal @protected */
  onTouchEnd(event: TouchEvent): void;

  /** @internal @protected */
  onTouchCancel(event: TouchEvent): void;
}

/** @internal */
export const TouchPositionGesture = (function (_super: typeof PositionGesture) {
  const TouchPositionGesture = _super.extend("TouchPositionGesture", {}) as PositionGestureClass<TouchPositionGesture<any, any>>;

  TouchPositionGesture.prototype.attachHoverEvents = function (this: TouchPositionGesture, view: View): void {
    view.addEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchPositionGesture.prototype.detachHoverEvents = function (this: TouchPositionGesture, view: View): void {
    view.removeEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchPositionGesture.prototype.attachPressEvents = function (this: TouchPositionGesture, view: View): void {
    view.addEventListener("touchmove", this.onTouchMove as EventListener);
    view.addEventListener("touchend", this.onTouchEnd as EventListener);
    view.addEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchPositionGesture.prototype.detachPressEvents = function (this: TouchPositionGesture, view: View): void {
    view.removeEventListener("touchmove", this.onTouchMove as EventListener);
    view.removeEventListener("touchend", this.onTouchEnd as EventListener);
    view.removeEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchPositionGesture.prototype.updateInput = function (this: TouchPositionGesture, input: PositionGestureInput, event: TouchEvent, touch: Touch): void {
    input.target = touch.target;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.dx = touch.clientX - input.x;
    input.dy = touch.clientY - input.y;
    input.dt = event.timeStamp - input.t;
    input.x = touch.clientX;
    input.y = touch.clientY;
    input.t = event.timeStamp;
  };

  TouchPositionGesture.prototype.onTouchStart = function (this: TouchPositionGesture, event: TouchEvent): void {
    const touches = event.targetTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getOrCreateInput(touch.identifier, "touch", false, touch.clientX, touch.clientY, event.timeStamp);
      this.updateInput(input, event, touch);
      if (!input.pressing) {
        this.beginPress(input, event);
      }
    }
  };

  TouchPositionGesture.prototype.onTouchMove = function (this: TouchPositionGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.movePress(input, event);
      }
    }
  };

  TouchPositionGesture.prototype.onTouchEnd = function (this: TouchPositionGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.endPress(input, event);
        if (!input.defaultPrevented) {
          this.press(input, event);
        }
        this.endHover(input, event);
      }
    }
  };

  TouchPositionGesture.prototype.onTouchCancel = function (this: TouchPositionGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.cancelPress(input, event);
        this.endHover(input, event);
      }
    }
  };

  TouchPositionGesture.construct = function <G extends TouchPositionGesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onTouchStart = gesture.onTouchStart.bind(gesture);
    gesture.onTouchMove = gesture.onTouchMove.bind(gesture);
    gesture.onTouchEnd = gesture.onTouchEnd.bind(gesture);
    gesture.onTouchCancel = gesture.onTouchCancel.bind(gesture);
    return gesture;
  };

  return TouchPositionGesture;
})(PositionGesture);
