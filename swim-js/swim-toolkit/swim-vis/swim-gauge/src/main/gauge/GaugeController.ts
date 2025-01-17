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
import {FastenerClass, Property} from "@swim/component";
import type {Trait} from "@swim/model";
import {ViewRef} from "@swim/view";
import type {GraphicsView} from "@swim/graphics";
import {Controller, TraitViewRef, TraitViewControllerSet} from "@swim/controller";
import type {DialView} from "../dial/DialView";
import type {DialTrait} from "../dial/DialTrait";
import {DialController} from "../dial/DialController";
import {GaugeView} from "./GaugeView";
import {GaugeTrait} from "./GaugeTrait";
import type {GaugeControllerObserver} from "./GaugeControllerObserver";

/** @public */
export class GaugeController extends Controller {
  override readonly observerType?: Class<GaugeControllerObserver>;

  protected setTitleView(title: string | undefined): void {
    const gaugeView = this.gauge.view;
    if (gaugeView !== null) {
      gaugeView.title.setText(title);
    }
  }

  protected setLimit(limit: number): void {
    const gaugeView = this.gauge.view;
    if (gaugeView !== null) {
      gaugeView.limit.setState(limit);
    }
  }

  @TraitViewRef<GaugeController["gauge"]>({
    traitType: GaugeTrait,
    observesTrait: true,
    willAttachTrait(gaugeTrait: GaugeTrait): void {
      this.owner.callObservers("controllerWillAttachGaugeTrait", gaugeTrait, this.owner);
    },
    didAttachTrait(gaugeTrait: GaugeTrait): void {
      this.owner.dials.addTraits(gaugeTrait.dials.traits);
      const gaugeView = this.view;
      if (gaugeView !== null) {
        this.owner.setTitleView(gaugeTrait.title.value);
        this.owner.setLimit(gaugeTrait.limit.value);
      }
    },
    willDetachTrait(gaugeTrait: GaugeTrait): void {
      const gaugeView = this.view;
      if (gaugeView !== null) {
        this.owner.setTitleView(void 0);
        this.owner.setLimit(0);
      }
      this.owner.dials.deleteTraits(gaugeTrait.dials.traits);
    },
    didDetachTrait(gaugeTrait: GaugeTrait): void {
      this.owner.callObservers("controllerDidDetachGaugeTrait", gaugeTrait, this.owner);
    },
    traitDidSetTitle(title: string | undefined): void {
      this.owner.setTitleView(title);
    },
    traitDidSetLimit(limit: number): void {
      this.owner.setLimit(limit);
    },
    traitWillAttachDial(dialTrait: DialTrait, targetTrait: Trait): void {
      this.owner.dials.addTrait(dialTrait, targetTrait);
    },
    traitDidDetachDial(dialTrait: DialTrait): void {
      this.owner.dials.deleteTrait(dialTrait);
    },
    viewType: GaugeView,
    observesView: true,
    initView(gaugeView: GaugeView): void {
      const dialControllers = this.owner.dials.controllers;
      for (const controllerId in dialControllers) {
        const dialController = dialControllers[controllerId]!;
        const dialView = dialController.dial.view;
        if (dialView !== null && dialView.parent === null) {
          dialController.dial.insertView(gaugeView);
        }
      }
      this.owner.title.setView(gaugeView.title.view);
      const gaugeTrait = this.trait;
      if (gaugeTrait !== null) {
        this.owner.setTitleView(gaugeTrait.title.value);
        this.owner.setLimit(gaugeTrait.limit.value);
      }
    },
    deinitView(gaugeView: GaugeView): void {
      this.owner.title.setView(null);
    },
    willAttachView(gaugeView: GaugeView): void {
      this.owner.callObservers("controllerWillAttachGaugeView", gaugeView, this.owner);
    },
    didDetachView(gaugeView: GaugeView): void {
      this.owner.callObservers("controllerDidDetachGaugeView", gaugeView, this.owner);
    },
    viewWillAttachTitle(titleView: GraphicsView): void {
      this.owner.title.setView(titleView);
    },
    viewDidDetachTitle(titleView: GraphicsView): void {
      this.owner.title.setView(null);
    },
  })
  readonly gauge!: TraitViewRef<this, GaugeTrait, GaugeView> & Observes<GaugeTrait & GaugeView>;
  static readonly gauge: FastenerClass<GaugeController["gauge"]>;

  @ViewRef<GaugeController["title"]>({
    viewKey: true,
    willAttachView(titleView: GraphicsView): void {
      this.owner.callObservers("controllerWillAttachGaugeTitleView", titleView, this.owner);
    },
    didDetachView(titleView: GraphicsView): void {
      this.owner.callObservers("controllerDidDetachGaugeTitleView", titleView, this.owner);
    },
  })
  readonly title!: ViewRef<this, GraphicsView>;
  static readonly title: FastenerClass<GaugeController["title"]>;

  @Property({valueType: Timing, value: true})
  readonly dialTiming!: Property<this, Timing | boolean | undefined, AnyTiming | boolean | undefined>;

  @TraitViewControllerSet<GaugeController["dials"]>({
    controllerType: DialController,
    binds: true,
    observes: true,
    get parentView(): GaugeView | null {
      return this.owner.gauge.view;
    },
    getTraitViewRef(dialController: DialController): TraitViewRef<unknown, DialTrait, DialView> {
      return dialController.dial;
    },
    willAttachController(dialController: DialController): void {
      this.owner.callObservers("controllerWillAttachDial", dialController, this.owner);
    },
    didAttachController(dialController: DialController): void {
      const dialTrait = dialController.dial.trait;
      if (dialTrait !== null) {
        this.attachDialTrait(dialTrait, dialController);
      }
      const dialView = dialController.dial.view;
      if (dialView !== null) {
        this.attachDialView(dialView, dialController);
      }
    },
    willDetachController(dialController: DialController): void {
      const dialView = dialController.dial.view;
      if (dialView !== null) {
        this.detachDialView(dialView, dialController);
      }
      const dialTrait = dialController.dial.trait;
      if (dialTrait !== null) {
        this.detachDialTrait(dialTrait, dialController);
      }
    },
    didDetachController(dialController: DialController): void {
      this.owner.callObservers("controllerDidDetachDial", dialController, this.owner);
    },
    controllerWillAttachDialTrait(dialTrait: DialTrait, dialController: DialController): void {
      this.owner.callObservers("controllerWillAttachDialTrait", dialTrait, dialController, this.owner);
      this.attachDialTrait(dialTrait, dialController);
    },
    controllerDidDetachDialTrait(dialTrait: DialTrait, dialController: DialController): void {
      this.detachDialTrait(dialTrait, dialController);
      this.owner.callObservers("controllerDidDetachDialTrait", dialTrait, dialController, this.owner);
    },
    attachDialTrait(dialTrait: DialTrait, dialController: DialController): void {
      // hook
    },
    detachDialTrait(dialTrait: DialTrait, dialController: DialController): void {
      // hook
    },
    controllerWillAttachDialView(dialView: DialView, dialController: DialController): void {
      this.owner.callObservers("controllerWillAttachDialView", dialView, dialController, this.owner);
      this.attachDialView(dialView, dialController);
    },
    controllerDidDetachDialView(dialView: DialView, dialController: DialController): void {
      this.detachDialView(dialView, dialController);
      this.owner.callObservers("controllerDidDetachDialView", dialView, dialController, this.owner);
    },
    attachDialView(dialView: DialView, dialController: DialController): void {
      const labelView = dialView.label.view;
      if (labelView !== null) {
        this.attachDialLabelView(labelView, dialController);
      }
      const legendView = dialView.legend.view;
      if (legendView !== null) {
        this.attachDialLegendView(legendView, dialController);
      }
    },
    detachDialView(dialView: DialView, dialController: DialController): void {
      const legendView = dialView.legend.view;
      if (legendView !== null) {
        this.detachDialLegendView(legendView, dialController);
      }
      const labelView = dialView.label.view;
      if (labelView !== null) {
        this.detachDialLabelView(labelView, dialController);
      }
      dialView.remove();
    },
    controllerDidSetDialValue(value: number, dialController: DialController): void {
      this.owner.callObservers("controllerDidSetDialValue", value, dialController, this.owner);
    },
    controllerDidSetDialLimit(limit: number, dialController: DialController): void {
      this.owner.callObservers("controllerDidSetDialLimit", limit, dialController, this.owner);
    },
    controllerWillAttachDialLabelView(labelView: GraphicsView, dialController: DialController): void {
      this.owner.callObservers("controllerWillAttachDialLabelView", labelView, dialController, this.owner);
      this.attachDialLabelView(labelView, dialController);
    },
    controllerDidDetachDialLabelView(labelView: GraphicsView, dialController: DialController): void {
      this.detachDialLabelView(labelView, dialController);
      this.owner.callObservers("controllerDidDetachDialLabelView", labelView, dialController, this.owner);
    },
    attachDialLabelView(labelView: GraphicsView, dialController: DialController): void {
      // hook
    },
    detachDialLabelView(labelView: GraphicsView, dialController: DialController): void {
      // hook
    },
    controllerWillAttachDialLegendView(legendView: GraphicsView, dialController: DialController): void {
      this.owner.callObservers("controllerWillAttachDialLegendView", legendView, dialController, this.owner);
      this.attachDialLegendView(legendView, dialController);
    },
    controllerDidDetachDialLegendView(legendView: GraphicsView, dialController: DialController): void {
      this.detachDialLegendView(legendView, dialController);
      this.owner.callObservers("controllerDidDetachDialLegendView", legendView, dialController, this.owner);
    },
    attachDialLegendView(legendView: GraphicsView, dialController: DialController): void {
      // hook
    },
    detachDialLegendView(legendView: GraphicsView, dialController: DialController): void {
      // hook
    },
  })
  readonly dials!: TraitViewControllerSet<this, DialTrait, DialView, DialController> & Observes<DialController> & {
    attachDialTrait(dialTrait: DialTrait, dialController: DialController): void;
    detachDialTrait(dialTrait: DialTrait, dialController: DialController): void;
    attachDialView(dialView: DialView, dialController: DialController): void;
    detachDialView(dialView: DialView, dialController: DialController): void;
    attachDialLabelView(labelView: GraphicsView, dialController: DialController): void;
    detachDialLabelView(labelView: GraphicsView, dialController: DialController): void;
    attachDialLegendView(legendView: GraphicsView, dialController: DialController): void;
    detachDialLegendView(legendView: GraphicsView, dialController: DialController): void;
  };
  static readonly dials: FastenerClass<GaugeController["dials"]>;
}
