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

import {Class, AnyTiming, Timing, Observes} from "@swim/util";
import {Affinity, FastenerClass} from "@swim/component";
import type {Length} from "@swim/math";
import type {Color} from "@swim/style";
import {Look, Mood, ColorOrLook} from "@swim/theme";
import {TraitViewRef, TraitViewControllerSet} from "@swim/controller";
import type {DataPointView} from "../data/DataPointView";
import type {DataPointTrait} from "../data/DataPointTrait";
import type {DataPointController} from "../data/DataPointController";
import {DataSetTrait} from "../data/DataSetTrait";
import {LinePlotView} from "./LinePlotView";
import {LinePlotTrait} from "./LinePlotTrait";
import {SeriesPlotController} from "./SeriesPlotController";
import type {LinePlotControllerObserver} from "./LinePlotControllerObserver";

/** @public */
export class LinePlotController<X = unknown, Y = unknown> extends SeriesPlotController<X, Y> {
  override readonly observerType?: Class<LinePlotControllerObserver<X, Y>>;

  @TraitViewControllerSet<LinePlotController<X, Y>["dataPoints"]>({
    extends: true,
    get parentView(): LinePlotView<X, Y> | null {
      return this.owner.plot.view;
    },
  })
  override readonly dataPoints!: TraitViewControllerSet<this, DataPointTrait<X, Y>, DataPointView<X, Y>, DataPointController<X, Y>> & SeriesPlotController<X, Y>["dataPoints"];
  static override readonly dataPoints: FastenerClass<LinePlotController["dataPoints"]>;

  protected setStroke(stroke: ColorOrLook | null, timing?: AnyTiming | boolean): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      if (timing === void 0 || timing === true) {
        timing = this.plotTiming.value;
        if (timing === true) {
          timing = plotView.getLook(Look.timing, Mood.ambient);
        }
      } else {
        timing = Timing.fromAny(timing);
      }
      if (stroke instanceof Look) {
        plotView.stroke.setLook(stroke, timing, Affinity.Intrinsic);
      } else {
        plotView.stroke.setState(stroke, timing, Affinity.Intrinsic);
      }
    }
  }

  protected setStrokeWidth(strokeWidth: Length | null, timing?: AnyTiming | boolean): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      if (timing === void 0 || timing === true) {
        timing = this.plotTiming.value;
        if (timing === true) {
          timing = plotView.getLook(Look.timing, Mood.ambient);
        }
      } else {
        timing = Timing.fromAny(timing);
      }
      plotView.strokeWidth.setState(strokeWidth, timing, Affinity.Intrinsic);
    }
  }

  @TraitViewRef<LinePlotController<X, Y>["plot"]>({
    traitType: LinePlotTrait,
    observesTrait: true,
    initTrait(plotTrait: LinePlotTrait<X, Y>): void {
      if (this.owner.dataSet.trait === null) {
        const dataSetTrait = plotTrait.getTrait(DataSetTrait) as DataSetTrait<X, Y>;
        if (dataSetTrait !== null) {
          this.owner.dataSet.setTrait(dataSetTrait);
        }
      }
      const plotView = this.view;
      if (plotView !== null) {
        const stroke = plotTrait.stroke.value;
        if (stroke !== null) {
          this.owner.setStroke(stroke);
        }
        const strokeWidth = plotTrait.strokeWidth.value;
        if (strokeWidth !== null) {
          this.owner.setStrokeWidth(strokeWidth);
        }
      }
    },
    willAttachTrait(plotTrait: LinePlotTrait<X, Y>): void {
      this.owner.callObservers("controllerWillAttachPlotTrait", plotTrait, this.owner);
    },
    didDetachTrait(plotTrait: LinePlotTrait<X, Y>): void {
      this.owner.callObservers("controllerDidDetachPlotTrait", plotTrait, this.owner);
    },
    traitDidSetStroke(stroke: ColorOrLook | null): void {
      this.owner.setStroke(stroke);
    },
    traitDidSetStrokeWidth(strokeWidth: Length | null): void {
      this.owner.setStrokeWidth(strokeWidth);
    },
    viewType: LinePlotView,
    observesView: true,
    initView(plotView: LinePlotView<X, Y>): void {
      const dataPointControllers = this.owner.dataPoints.controllers;
      for (const controllerId in dataPointControllers) {
        const dataPointController = dataPointControllers[controllerId]!;
        dataPointController.dataPoint.insertView(plotView);
      }
      const plotTrait = this.trait;
      if (plotTrait !== null) {
        const stroke = plotTrait.stroke.value;
        if (stroke !== null) {
          this.owner.setStroke(stroke);
        }
        const strokeWidth = plotTrait.strokeWidth.value;
        if (strokeWidth !== null) {
          this.owner.setStrokeWidth(strokeWidth);
        }
      }
    },
    willAttachView(plotView: LinePlotView<X, Y>): void {
      this.owner.callObservers("controllerWillAttachPlotView", plotView, this.owner);
    },
    didDetachView(plotView: LinePlotView<X, Y>): void {
      this.owner.callObservers("controllerDidDetachPlotView", plotView, this.owner);
    },
    viewDidSetStroke(stroke: Color | null): void {
      this.owner.callObservers("controllerDidSetPlotStroke", stroke, this.owner);
    },
    viewDidSetStrokeWidth(strokeWidth: Length | null): void {
      this.owner.callObservers("controllerDidSetPlotStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly plot!: TraitViewRef<this, LinePlotTrait<X, Y>, LinePlotView<X, Y>> & Observes<LinePlotTrait<X, Y> & LinePlotView<X, Y>>;
  static readonly plot: FastenerClass<LinePlotController["plot"]>;
}
