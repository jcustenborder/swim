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

import {Mutable, Class, AnyTiming, Timing, Easing, Observes} from "@swim/util";
import {Affinity, FastenerClass, Animator} from "@swim/component";
import {AnyLength, Length, AnyR2Point, R2Point, R2Box} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {AnyColor, Color} from "@swim/style";
import {Look, Mood, AnyColorOrLook, ThemeAnimator} from "@swim/theme";
import {View, ViewRef} from "@swim/view";
import {StrokeView, PaintingContext, PaintingRenderer} from "@swim/graphics";
import {GeoView} from "../geo/GeoView";
import type {GeoRippleViewObserver} from "./GeoRippleViewObserver";

/** @public */
export interface GeoRippleOptions {
  source?: GeoView | null;
  center?: AnyGeoPoint | null;
  width?: AnyLength | null;
  radius?: AnyLength | null;
  color?: AnyColorOrLook | null;
  opacity?: number;
  timing?: AnyTiming | number | boolean;
}

/** @public */
export class GeoRippleView extends GeoView implements StrokeView {
  constructor() {
    super();
    Object.defineProperty(this, "viewBounds", {
      value: R2Box.undefined(),
      writable: true,
      enumerable: true,
      configurable: true,
    });
    this.setFlags(this.flags | View.UnboundedFlag);
  }

  override readonly observerType?: Class<GeoRippleViewObserver>;

  @Animator<GeoRippleView["geoCenter"]>({
    valueType: GeoPoint,
    value: null,
    didSetState(geoCenter: GeoPoint | null): void {
      this.owner.projectGeoCenter(geoCenter);
    },
    didSetValue(geoCenter: GeoPoint | null): void {
      this.owner.setGeoBounds(geoCenter !== null ? geoCenter.bounds : GeoBox.undefined());
      if (this.mounted) {
        this.owner.projectRipple();
      }
      this.owner.callObservers("viewDidSetGeoCenter", geoCenter, this.owner);
    },
  })
  readonly geoCenter!: Animator<this, GeoPoint | null, AnyGeoPoint | null>;

  @Animator<GeoRippleView["viewCenter"]>({
    valueType: R2Point,
    value: R2Point.undefined(),
    updateFlags: View.NeedsRender,
    didSetValue(viewCenter: R2Point | null): void {
      this.owner.updateViewBounds();
    },
  })
  readonly viewCenter!: Animator<this, R2Point | null, AnyR2Point | null>;

  @ThemeAnimator<GeoRippleView["radius"]>({
    valueType: Length,
    value: Length.zero(),
    updateFlags: View.NeedsRender,
    didTransition() {
      this.owner.source.setView(null);
      this.owner.remove();
    },
  })
  readonly radius!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Color, value: null, look: Look.accentColor, inherits: true, updateFlags: View.NeedsRender})
  readonly stroke!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({valueType: Length, value: Length.px(1), inherits: true, updateFlags: View.NeedsRender})
  readonly strokeWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ViewRef<GeoRippleView["source"]>({
    observes: true,
    didAttachView(sourceView: GeoView): void {
      this.owner.geoCenter.setState(sourceView.geoBounds.center, Affinity.Intrinsic);
    },
    viewDidUnmount(sourceView: GeoView): void {
      this.owner.remove();
    },
    viewDidSetGeoBounds(geoBounds: GeoBox): void {
      this.owner.geoCenter.setState(geoBounds.center, Affinity.Intrinsic);
    },
  })
  readonly source!: ViewRef<this, GeoView> & Observes<GeoView>;
  static readonly source: FastenerClass<GeoRippleView["source"]>;

  protected override onProject(): void {
    super.onProject();
    this.projectRipple();
  }

  protected projectGeoCenter(geoCenter: GeoPoint | null): void {
    if (this.mounted) {
      const viewCenter = geoCenter !== null && geoCenter.isDefined()
                       ? this.geoViewport.value.project(geoCenter)
                       : null;
      this.viewCenter.setInterpolatedValue(this.viewCenter.value, viewCenter);
      this.projectRipple();
    }
  }

  protected projectRipple(): void {
    if (this.viewCenter.hasAffinity(Affinity.Intrinsic)) {
      const geoCenter = this.geoCenter.value;
      const viewCenter = geoCenter !== null && geoCenter.isDefined()
                       ? this.geoViewport.value.project(geoCenter)
                       : null;
      this.viewCenter.setValue(viewCenter, Affinity.Intrinsic);
    }
  }

  protected override onRender(): void {
    super.onRender();
    const renderer = this.renderer.value;
    if (renderer instanceof PaintingRenderer && !this.hidden && !this.culled) {
      this.renderRipple(renderer.context, this.viewFrame);
    }
  }

  protected renderRipple(context: PaintingContext, frame: R2Box): void {
    const viewCenter = this.viewCenter.value;
    if (viewCenter !== null && viewCenter.isDefined()) {
      const size = Math.min(frame.width, frame.height);
      const radius = this.radius.getValue().pxValue(size);
      const stroke = this.stroke.value;
      if (stroke !== null) {
        // save
        const contextLineWidth = context.lineWidth;
        const contextStrokeStyle = context.strokeStyle;

        context.beginPath();
        context.arc(viewCenter.x, viewCenter.y, radius, 0, 2 * Math.PI);

        const strokeWidth = this.strokeWidth.value;
        if (strokeWidth !== null) {
          context.lineWidth = strokeWidth.pxValue(size);
        }
        context.strokeStyle = stroke.toString();
        context.stroke();

        // restore
        context.lineWidth = contextLineWidth;
        context.strokeStyle = contextStrokeStyle;
      }
    }
  }

  protected override renderGeoBounds(outlineColor: Color, outlineWidth: number): void {
    // nop
  }

  protected override updateGeoBounds(): void {
    // nop
  }

  override readonly viewBounds!: R2Box;

  protected updateViewBounds(): void {
    (this as Mutable<GeoRippleView>).viewBounds = this.deriveViewBounds();
  }

  override deriveViewBounds(): R2Box {
    const viewCenter = this.viewCenter.value;
    if (viewCenter !== null && viewCenter.isDefined()) {
      return viewCenter.bounds;
    } else {
      return R2Box.undefined();
    }
  }

  ripple(options?: GeoRippleOptions): this {
    let source: GeoView | null;
    if (options === void 0 || options.source === void 0) {
      source = null;
    } else {
      source = options.source;
    }
    let center: GeoPoint | null;
    if (options === void 0 || options.center === void 0 || options.center === null) {
      center = null;
    } else {
      center = GeoPoint.fromAny(options.center);
    }
    let width: Length | null;
    if (options === void 0 || options.width === void 0 || options.width === null) {
      width = null;
    } else {
      width = Length.fromAny(options.width);
    }
    let radius: Length;
    if (options === void 0 || options.radius === void 0 || options.radius === null) {
      radius = Length.pct(12.5);
    } else {
      radius = Length.fromAny(options.radius);
    }
    let color: Color | null;
    if (options === void 0 || options.color === void 0 || options.color === null) {
      color = this.getLookOr(Look.accentColor, null);
    } else if (options.color instanceof Look) {
      color = this.getLookOr(options.color, null);
    } else {
      color = Color.fromAny(options.color);
    }
    let timing: Timing | boolean;
    if (options === void 0 || options.timing === void 0 || options.timing === true) {
      timing = this.getLookOr(Look.timing, Mood.ambient, false);
    } else if (typeof options.timing === "number") {
      timing = Easing.linear.withDuration(options.timing);
    } else {
      timing = Timing.fromAny(options.timing);
    }
    const opacity = options !== void 0 ? options.opacity : void 0;

    if (source !== null) {
      this.source.setView(source);
    }
    if (center !== null) {
      this.geoCenter.setState(center, Affinity.Intrinsic);
    }
    if (width !== null) {
      this.strokeWidth.setState(width, Affinity.Intrinsic);
    }
    this.radius.setState(radius, timing);
    if (color !== null) {
      this.stroke.setState(opacity !== void 0 ? color.alpha(opacity) : color);
      this.stroke.setState(color.alpha(0), timing);
    }

    return this;
  }

  static ripple(sourceView: GeoView, options?: GeoRippleOptions): GeoRippleView | null {
    if (!document.hidden && !sourceView.hidden && !sourceView.culled &&
        sourceView.geoBounds.intersects(sourceView.geoViewport.value.geoFrame)) {
      const rippleView = GeoRippleView.create();
      rippleView.source.setView(sourceView);
      let containerView = sourceView.getBase(GeoView);
      if (containerView === null) {
        containerView = sourceView;
      }
      containerView.appendChild(rippleView);
      rippleView.ripple(options);
      return rippleView;
    } else {
      return null;
    }
  }
}
