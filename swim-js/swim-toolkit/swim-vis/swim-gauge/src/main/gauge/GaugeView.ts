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

import type {Class, Observes} from "@swim/util";
import {Affinity, FastenerClass, Animator} from "@swim/component";
import {AnyLength, Length, AnyAngle, Angle, AnyR2Point, R2Point, R2Box} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {Look, ThemeAnimator} from "@swim/theme";
import {View, ViewRef, ViewSet} from "@swim/view";
import {GraphicsViewInit, GraphicsView, TypesetView, TextRunView} from "@swim/graphics";
import {AnyDialView, DialView} from "../dial/DialView";
import type {GaugeViewObserver} from "./GaugeViewObserver";

/** @public */
export type AnyGaugeView = GaugeView | GaugeViewInit;

/** @public */
export interface GaugeViewInit extends GraphicsViewInit {
  limit?: number;
  center?: AnyR2Point;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  startAngle?: AnyAngle;
  sweepAngle?: AnyAngle;
  cornerRadius?: AnyLength;
  dialSpacing?: AnyLength;
  dialColor?: AnyColor;
  meterColor?: AnyColor;
  labelPadding?: AnyLength;
  tickAlign?: number;
  tickRadius?: AnyLength;
  tickLength?: AnyLength;
  tickWidth?: AnyLength;
  tickPadding?: AnyLength;
  tickColor?: AnyColor;
  font?: AnyFont;
  textColor?: AnyColor;
  title?: GraphicsView | string;
  dials?: AnyDialView[];
}

/** @public */
export class GaugeView extends GraphicsView {
  override readonly observerType?: Class<GaugeViewObserver>;

  @Animator({valueType: Number, value: 0, updateFlags: View.NeedsLayout})
  readonly limit!: Animator<this, number>;

  @Animator({valueType: R2Point, value: R2Point.origin(), updateFlags: View.NeedsLayout})
  readonly center!: Animator<this, R2Point, AnyR2Point>;

  @ThemeAnimator({valueType: Length, value: Length.pct(30), updateFlags: View.NeedsLayout})
  readonly innerRadius!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.pct(40), updateFlags: View.NeedsLayout})
  readonly outerRadius!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Angle, value: Angle.rad(-Math.PI / 2), updateFlags: View.NeedsLayout})
  readonly startAngle!: ThemeAnimator<this, Angle, AnyAngle>;

  @ThemeAnimator({valueType: Angle, value: Angle.rad(2 * Math.PI), updateFlags: View.NeedsLayout})
  readonly sweepAngle!: ThemeAnimator<this, Angle, AnyAngle>;

  @ThemeAnimator({valueType: Length, value: Length.pct(50)})
  readonly cornerRadius!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.px(1), updateFlags: View.NeedsLayout})
  readonly dialSpacing!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Color, value: null, look: Look.etchColor})
  readonly dialColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({valueType: Color, value: null, look: Look.accentColor})
  readonly meterColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({valueType: Length, value: Length.pct(50)})
  readonly labelPadding!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Number, value: 1})
  readonly tickAlign!: ThemeAnimator<this, number>;

  @ThemeAnimator({valueType: Length, value: Length.pct(45)})
  readonly tickRadius!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.pct(50)})
  readonly tickLength!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.px(1)})
  readonly tickWidth!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.px(2)})
  readonly tickPadding!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Color, value: null, look: Look.legendColor})
  readonly tickColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({valueType: Font, value: null, inherits: true})
  readonly font!: ThemeAnimator<this, Font | null, AnyFont | null>;

  @ThemeAnimator({valueType: Color, value: null, look: Look.legendColor})
  readonly textColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ViewRef<GaugeView["title"]>({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    initView(titleView: GraphicsView): void {
      if (TypesetView.is(titleView)) {
        titleView.textAlign.setState("center", Affinity.Intrinsic);
        titleView.textBaseline.setState("middle", Affinity.Intrinsic);
        titleView.textOrigin.setState(this.owner.center.state, Affinity.Intrinsic);
      }
    },
    willAttachView(titleView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachTitle", titleView, this.owner);
    },
    didDetachView(titleView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachTitle", titleView, this.owner);
    },
    setText(title: string | undefined): GraphicsView {
      let titleView = this.view;
      if (titleView === null) {
        titleView = this.createView();
        this.setView(titleView);
      }
      if (titleView instanceof TextRunView) {
        titleView.text(title !== void 0 ? title : "");
      }
      return titleView;
    },
  })
  readonly title!: ViewRef<this, GraphicsView> & {
    setText(title: string | undefined): GraphicsView,
  };
  static readonly title: FastenerClass<GaugeView["title"]>;

  @ViewSet<GaugeView["dials"]>({
    viewType: DialView,
    binds: true,
    observes: true,
    willAttachView(dialView: DialView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachDial", dialView, targetView, this.owner);
    },
    didAttachView(dialView: DialView): void {
      const labelView = dialView.label.view;
      if (labelView !== null) {
        this.attachLabelView(labelView);
      }
      const legendView = dialView.legend.view;
      if (legendView !== null) {
        this.attachLegendView(legendView);
      }
    },
    willDetachView(dialView: DialView): void {
      const legendView = dialView.legend.view;
      if (legendView !== null) {
        this.detachLegendView(legendView);
      }
      const labelView = dialView.label.view;
      if (labelView !== null) {
        this.detachLabelView(labelView);
      }
    },
    didDetachView(dialView: DialView): void {
      this.owner.callObservers("viewDidDetachDial", dialView, this.owner);
    },
    viewDidSetValue(value: number): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
    viewWillAttachLabel(labelView: GraphicsView): void {
      this.attachLabelView(labelView);
    },
    viewDidDetachLabel(labelView: GraphicsView): void {
      this.detachLabelView(labelView);
    },
    attachLabelView(labelView: GraphicsView): void {
      // hook
    },
    detachLabelView(labelView: GraphicsView): void {
      // hook
    },
    viewWillAttachLegend(legendView: GraphicsView): void {
      this.attachLegendView(legendView);
    },
    viewDidDetachLegend(legendView: GraphicsView): void {
      this.detachLegendView(legendView);
    },
    attachLegendView(legendView: GraphicsView): void {
      // hook
    },
    detachLegendView(legendView: GraphicsView): void {
      // hook
    },
  })
  readonly dials!: ViewSet<this, DialView> & Observes<DialView> & {
    attachLabelView(labelView: GraphicsView): void,
    detachLabelView(labelView: GraphicsView): void,
    attachLegendView(legendView: GraphicsView): void,
    detachLegendView(legendView: GraphicsView): void,
  };
  static readonly dials: FastenerClass<GaugeView["dials"]>;

  protected override onLayout(): void {
    super.onLayout();
    this.layoutGauge(this.viewFrame);
  }

  protected layoutGauge(frame: R2Box): void {
    if (this.center.hasAffinity(Affinity.Intrinsic)) {
      const cx = (frame.xMin + frame.xMax) / 2;
      const cy = (frame.yMin + frame.yMax) / 2;
      this.center.setState(new R2Point(cx, cy), Affinity.Intrinsic);
    }

    const dialViews = this.dials.views;

    let autoCount = 0;
    for (const viewId in dialViews) {
      const dialView = dialViews[viewId]!;
      if (dialView.arrangement.value === "auto") {
        autoCount += 1;
      }
    }

    const size = Math.min(frame.width, frame.height);
    const gaugeLimit = this.limit.getValue();
    const startAngle = this.startAngle.getValue();
    const sweepAngle = this.sweepAngle.getValue();
    let r0 = this.innerRadius.getValue().pxValue(size);
    const r1 = this.outerRadius.getValue().pxValue(size);
    const rs = this.dialSpacing.getValue().pxValue(size);
    const dr = autoCount > 1 ? (r1 - r0 - rs * (autoCount - 1)) / autoCount : r1 - r0;

    for (const viewId in dialViews) {
      const dialView = dialViews[viewId]!;
      if (dialView.arrangement.value === "auto") {
        if (isFinite(gaugeLimit)) {
          const dialLimit = dialView.limit.getValue();
          dialView.limit.setState(Math.max(dialLimit, gaugeLimit), Affinity.Intrinsic);
        }
        dialView.startAngle.setState(startAngle, Affinity.Intrinsic);
        dialView.sweepAngle.setState(sweepAngle, Affinity.Intrinsic);
        dialView.innerRadius.setState(Length.px(r0), Affinity.Intrinsic);
        dialView.outerRadius.setState(Length.px(r0 + dr), Affinity.Intrinsic);
        r0 = r0 + dr + rs;
      }
    }

    const titleView = this.title.view;
    if (TypesetView.is(titleView)) {
      titleView.textOrigin.setState(this.center.state, Affinity.Intrinsic);
    }
  }

  override init(init: GaugeViewInit): void {
    super.init(init);
    if (init.limit !== void 0) {
      this.limit(init.limit);
    }
    if (init.innerRadius !== void 0) {
      this.innerRadius(init.innerRadius);
    }
    if (init.outerRadius !== void 0) {
      this.outerRadius(init.outerRadius);
    }
    if (init.startAngle !== void 0) {
      this.startAngle(init.startAngle);
    }
    if (init.sweepAngle !== void 0) {
      this.sweepAngle(init.sweepAngle);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
    }
    if (init.dialSpacing !== void 0) {
      this.dialSpacing(init.dialSpacing);
    }
    if (init.dialColor !== void 0) {
      this.dialColor(init.dialColor);
    }
    if (init.meterColor !== void 0) {
      this.meterColor(init.meterColor);
    }
    if (init.labelPadding !== void 0) {
      this.labelPadding(init.labelPadding);
    }
    if (init.tickAlign !== void 0) {
      this.tickAlign(init.tickAlign);
    }
    if (init.tickRadius !== void 0) {
      this.tickRadius(init.tickRadius);
    }
    if (init.tickLength !== void 0) {
      this.tickLength(init.tickLength);
    }
    if (init.tickWidth !== void 0) {
      this.tickWidth(init.tickWidth);
    }
    if (init.tickPadding !== void 0) {
      this.tickPadding(init.tickPadding);
    }
    if (init.tickColor !== void 0) {
      this.tickColor(init.tickColor);
    }
    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
    if (typeof init.title === "string") {
      this.title.setText(init.title);
    } else if (init.title !== void 0) {
      this.title.setView(init.title);
    }
    const dials = init.dials;
    if (dials !== void 0) {
      for (let i = 0, n = dials.length; i < n; i += 1) {
        const dial = dials[i]!;
        this.appendChild(DialView.fromAny(dial), dial.key);
      }
    }
  }
}
