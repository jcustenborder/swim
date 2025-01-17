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

import type {Cursor} from "@swim/util";
import type {STreeContext} from "./STreeContext";
import {STreePage} from "./STreePage";
import {STreeNodeCursor} from "./"; // forward import

/** @internal */
export class STreeNode<V, I> extends STreePage<V, I> {
  constructor(pages: ReadonlyArray<STreePage<V, I>>, knots: ReadonlyArray<number>, size: number) {
    super();
    this.pages = pages;
    this.knots = knots;
    this.size = size;
  }

  /** @internal */
  readonly pages: ReadonlyArray<STreePage<V, I>>;

  /** @internal */
  readonly knots: ReadonlyArray<number>;

  override get arity(): number {
    return this.pages.length;
  }

  override readonly size: number;

  override isEmpty(): boolean {
    return this.size === 0;
  }

  override get(index: number): V | undefined {
    let x = this.lookup(index);
    if (x >= 0) {
      x += 1;
    } else {
      x = -(x + 1);
    }
    const i = x === 0 ? index : index - this.knots[x - 1]!;
    return this.pages[x]!.get(i);
  }

  override getEntry(index: number): [I, V] | undefined {
    let x = this.lookup(index);
    if (x >= 0) {
      x += 1;
    } else {
      x = -(x + 1);
    }
    const i = x === 0 ? index : index - this.knots[x - 1]!;
    return this.pages[x]!.getEntry(i);
  }

  override updated(index: number, newValue: V, tree: STreeContext<V, I>): STreeNode<V, I> {
    let x = this.lookup(index);
    if (x >= 0) {
      x += 1;
    } else {
      x = -(x + 1);
    }
    const i = x === 0 ? index : index - this.knots[x - 1]!;
    const oldPage = this.pages[x]!;
    const newPage = oldPage.updated(i, newValue, tree);
    if (oldPage !== newPage) {
      if (oldPage.size !== newPage.size && tree.pageShouldSplit(newPage)) {
        return this.updatedPageSplit(x, newPage, oldPage);
      } else {
        return this.updatedPage(x, newPage, oldPage);
      }
    } else {
      return this;
    }
  }

  /** @internal */
  updatedPage(x: number, newPage: STreePage<V, I>, oldPage: STreePage<V, I>): STreeNode<V, I> {
    const oldPages = this.pages;
    const newPages = oldPages.slice(0);
    newPages[x] = newPage;

    const oldKnots = this.knots;
    let newKnots: number[];
    let newSize: number;
    if (oldPages.length - 1 > 0) {
      newKnots = oldKnots.slice(0);
      if (x > 0) {
        newSize = oldKnots[x - 1]!;
      } else {
        newSize = 0;
      }
      for (let i = x; i < newKnots.length; i += 1) {
        newSize += newPages[i]!.size;
        newKnots[i] = newSize;
      }
      newSize += newPages[newKnots.length]!.size;
    } else {
      newKnots = [];
      newSize = 0;
    }

    return new STreeNode(newPages, newKnots, newSize);
  }

  /** @internal */
  updatedPageSplit(x: number, newPage: STreePage<V, I>, oldPage: STreePage<V, I>): STreeNode<V, I> {
    const oldPages = this.pages;
    const newPages = new Array<STreePage<V, I>>(oldPages.length + 1);
    for (let i = 0; i < x; i += 1) {
      newPages[i] = oldPages[i]!;
    }

    const newLeftPage = newPage.splitLeft(newPage.arity >>> 1);
    const newRightPage = newPage.splitRight(newPage.arity >>> 1);
    newPages[x] = newLeftPage;
    newPages[x + 1] = newRightPage;
    for (let i = x + 1; i < oldPages.length; i += 1) {
      newPages[i + 1] = oldPages[i]!;
    }

    return STreeNode.create(newPages);
  }

  /** @internal */
  updatedPageMerge(x: number, newPage: STreeNode<V, I>, oldPage: STreePage<V, I>): STreeNode<V, I> {
    const oldPages = this.pages;
    const midPages = newPage.pages;
    const newPages = new Array<STreePage<V, I>>(oldPages.length + midPages.length - 1);
    for (let i = 0; i < x; i += 1) {
      newPages[i] = oldPages[i]!;
    }
    for (let i = 0; i < midPages.length; i += 1) {
      newPages[i + x] = midPages[i]!;
    }
    for (let i = x + 1; i < oldPages.length; i += 1) {
      newPages[i + midPages.length - 1] = oldPages[i]!;
    }

    return STreeNode.create(newPages);
  }

  override inserted(index: number, newValue: V, id: I | undefined, tree: STreeContext<V, I>): STreeNode<V, I> {
    let x = this.lookup(index);
    if (x >= 0) {
      x += 1;
    } else {
      x = -(x + 1);
    }
    const subIndex = x === 0 ? index : index - this.knots[x - 1]!;
    const oldPage = this.pages[x]!;
    const newPage = oldPage.inserted(subIndex, newValue, id, tree);
    if (oldPage !== newPage) {
      if (tree.pageShouldSplit(newPage)) {
        return this.updatedPageSplit(x, newPage, oldPage);
      } else {
        return this.updatedPage(x, newPage, oldPage);
      }
    } else {
      return this;
    }
  }

  override removed(index: number, tree: STreeContext<V, I>): STreePage<V, I> {
    let x = this.lookup(index);
    if (x >= 0) {
      x += 1;
    } else {
      x = -(x + 1);
    }
    const subIndex = x === 0 ? index : index - this.knots[x - 1]!;
    const oldPage = this.pages[x]!;
    const newPage = oldPage.removed(subIndex, tree);
    if (oldPage !== newPage) {
      return this.replacedPage(x, newPage, oldPage, tree);
    } else {
      return this;
    }
  }

  /** @internal */
  replacedPage(x: number, newPage: STreePage<V, I>, oldPage: STreePage<V, I>,
               tree: STreeContext<V, I>): STreePage<V, I> {
    if (!newPage.isEmpty()) {
      if (newPage instanceof STreeNode && tree.pageShouldMerge(newPage)) {
        return this.updatedPageMerge(x, newPage, oldPage);
      } else {
        return this.updatedPage(x, newPage, oldPage);
      }
    } else if (this.pages.length > 2) {
      return this.removedPage(x, newPage, oldPage);
    } else if (this.pages.length > 1) {
      if (x === 0) {
        return this.pages[1]!;
      } else {
        return this.pages[0]!;
      }
    } else {
      return STreePage.empty();
    }
  }

  /** @internal */
  removedPage(x: number, newPage: STreePage<V, I>, oldPage: STreePage<V, I>): STreeNode<V, I> {
    const oldPages = this.pages;
    const newPages = new Array<STreePage<V, I>>(oldPages.length - 1);
    for (let i = 0; i < x; i += 1) {
      newPages[i] = oldPages[i]!;
    }
    for (let i = x + 1; i < oldPages.length; i += 1) {
      newPages[i - 1] = oldPages[i]!;
    }

    const oldKnots = this.knots;
    const newKnots = new Array<number>(oldKnots.length - 1);
    let newSize: number;
    if (x > 0) {
      for (let i = 0; i < x; i += 1) {
        newKnots[i] = oldKnots[i]!;
      }
      newSize = oldKnots[x - 1]!;
    } else {
      newSize = 0;
    }
    for (let i = x; i < newKnots.length; i += 1) {
      newSize += newPages[i]!.size;
      newKnots[i] = newSize;
    }
    newSize += newPages[newKnots.length]!.size;

    return new STreeNode(newPages, newKnots, newSize);
  }

  override drop(lower: number, tree: STreeContext<V, I>): STreePage<V, I> {
    if (lower > 0) {
      if (lower < this.size) {
        let x = this.lookup(lower);
        if (x >= 0) {
          x += 1;
        } else {
          x = -(x + 1);
        }
        lower = x === 0 ? lower : lower - this.knots[x - 1]!;
        const oldPages = this.pages;
        const n = oldPages.length - x;
        if (n > 1) {
          let newNode: STreeNode<V, I>;
          if (x > 0) {
            const newPages = new Array<STreePage<V, I>>(n);
            for (let i = 0; i < n; i += 1) {
              newPages[i] = oldPages[i + x]!;
            }
            newNode = STreeNode.create(newPages);
          } else {
            newNode = this;
          }
          if (lower > 0) {
            const oldPage = oldPages[x]!;
            const newPage = oldPage.drop(lower, tree);
            return newNode.replacedPage(0, newPage, oldPage, tree);
          } else {
            return newNode;
          }
        } else {
          return oldPages[x]!.drop(lower, tree);
        }
      } else {
        return STreePage.empty();
      }
    } else {
      return this;
    }
  }

  override take(upper: number, tree: STreeContext<V, I>): STreePage<V, I> {
    if (upper < this.size) {
      if (upper > 0) {
        let x = this.lookup(upper);
        if (x >= 0) {
          x += 1;
        } else {
          x = -(x + 1);
        }
        upper = x === 0 ? upper : upper - this.knots[x - 1]!;
        const oldPages = this.pages;
        const n = upper === 0 ? x : x + 1;
        if (n > 1) {
          let newNode: STreeNode<V, I>;
          if (x < oldPages.length) {
            const newPages = new Array<STreePage<V, I>>(n);
            for (let i = 0; i < n; i += 1) {
              newPages[i] = oldPages[i]!;
            }
            const newKnots = new Array<number>(n - 1);
            for (let i = 0; i < newKnots.length; i += 1) {
              newKnots[i] = this.knots[i]!;
            }
            const newSize = newKnots[n - 2]! + newPages[n - 1]!.size;
            newNode = new STreeNode(newPages, newKnots, newSize);
          } else {
            newNode = this;
          }
          if (upper > 0) {
            const oldPage = oldPages[x]!;
            const newPage = oldPage.take(upper, tree);
            return newNode.replacedPage(x, newPage, oldPage, tree);
          } else {
            return newNode;
          }
        } else if (upper > 0) {
          return oldPages[0]!.take(upper, tree);
        } else {
          return oldPages[0]!;
        }
      } else {
        return STreePage.empty();
      }
    } else {
      return this;
    }
  }

  override balanced(tree: STreeContext<V, I>): STreeNode<V, I> {
    if (this.pages.length > 1 && tree.pageShouldSplit(this)) {
      const x = this.knots.length >>> 1;
      return this.split(x);
    } else {
      return this;
    }
  }

  override split(x: number): STreeNode<V, I> {
    const newPages = new Array<STreePage<V, I>>(2);
    const newLeftPage = this.splitLeft(x);
    const newRightPage = this.splitRight(x);
    newPages[0] = newLeftPage;
    newPages[1] = newRightPage;

    const newKnots = new Array<number>(1);
    newKnots[0] = newLeftPage.size;

    return new STreeNode(newPages, newKnots, this.size);
  }

  override splitLeft(x: number): STreeNode<V, I> {
    const oldPages = this.pages;
    const newPages = new Array<STreePage<V, I>>(x + 1);
    for (let i = 0; i < x + 1; i += 1) {
      newPages[i] = oldPages[i]!;
    }

    const oldKnots = this.knots;
    const newKnots = new Array<number>(x);
    for (let i = 0; i < x; i += 1) {
      newKnots[i] = oldKnots[i]!;
    }

    let newSize = 0;
    for (let i = 0; i <= x; i += 1) {
      newSize += newPages[i]!.size;
    }

    return new STreeNode(newPages, newKnots, newSize);
  }

  override splitRight(x: number): STreeNode<V, I> {
    const oldPages = this.pages;
    const y = oldPages.length - (x + 1);
    const newPages = new Array<STreePage<V, I>>(y);
    for (let i = 0; i < y; i += 1) {
      newPages[i] = oldPages[i + (x + 1)]!;
    }

    const newKnots = new Array<number>(y - 1);
    let newSize;
    if (y > 0) {
      newSize = newPages[0]!.size;
      for (let i = 1; i < y; i += 1) {
        newKnots[i - 1] = newSize;
        newSize += newPages[i]!.size;
      }
    } else {
      newSize = 0;
    }

    return new STreeNode(newPages, newKnots, newSize);
  }

  override forEach<T, S>(callback: (this: S, value: V, index: number, id: I) => T | void,
                         thisArg: S, offset: number): T | undefined {
    for (let i = 0; i < this.pages.length; i += 1) {
      const page = this.pages[i]!;
      const result = page.forEach(callback, thisArg, offset);
      if (result !== void 0) {
        return result;
      }
      offset += page.size;
    }
    return void 0;
  }

  override entries(): Cursor<[I, V]> {
    return new STreeNodeCursor(this.pages);
  }

  override reverseEntries(): Cursor<[I, V]> {
    return new STreeNodeCursor(this.pages, this.size, this.pages.length);
  }

  /** @internal */
  lookup(index: number): number {
    let lo = 0;
    let hi = this.knots.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (index > this.knots[mid]!) {
        lo = mid + 1;
      } else if (index < this.knots[mid]!) {
        hi = mid - 1;
      } else {
        return mid;
      }
    }
    return -(lo + 1);
  }

  static create<V, I>(pages: ReadonlyArray<STreePage<V, I>>): STreeNode<V, I> {
    const knots = new Array<number>(pages.length - 1);
    let size = 0;
    for (let i = 0, n  = knots.length; i < n; i += 1) {
      size += pages[i]!.size;
      knots[i] = size;
    }
    size += pages[knots.length]!.size;
    return new STreeNode(pages, knots, size);
  }
}
