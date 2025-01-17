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

package swim.db;

import java.lang.ref.WeakReference;
import swim.codec.Output;
import swim.codec.Unicode;
import swim.concurrent.Cont;
import swim.recon.Recon;
import swim.structure.Num;
import swim.structure.Record;
import swim.structure.Slot;
import swim.structure.Value;
import swim.util.Builder;
import swim.util.CombinerFunction;
import swim.util.Cursor;

public final class STreePageRef extends PageRef {

  final PageContext context;
  final PageType pageType;
  final int stem;
  final int post;
  final int zone;
  final long base;
  final long span;
  final Value fold;
  Object page;
  int pageRefSize;
  int pageSize;
  int diffSize;
  long treeSize;

  public STreePageRef(PageContext context, PageType pageType, int stem, int post,
                      int zone, long base, long span, Value fold, Object page,
                      int pageRefSize, int pageSize, int diffSize, long treeSize) {
    this.context = context;
    this.pageType = pageType;
    this.stem = stem;
    this.post = post;
    this.zone = zone;
    this.base = base;
    this.span = span;
    this.fold = fold;
    this.page = page;
    this.pageRefSize = pageRefSize;
    this.pageSize = pageSize;
    this.diffSize = diffSize;
    this.treeSize = treeSize;
  }

  public STreePageRef(PageContext context, PageType pageType, int stem, int post,
                      int zone, long base, long span, Value fold, Object page) {
    this(context, pageType, stem, post, zone, base, span, fold, page, -1, -1, -1, -1L);
  }

  public STreePageRef(PageContext context, PageType pageType, int stem, int post,
                      int zone, long base, long span, Value fold) {
    this(context, pageType, stem, post, zone, base, span, fold, null, -1, -1, -1, -1L);
  }

  @Override
  public PageContext pageContext() {
    return this.context;
  }

  @Override
  public PageType pageType() {
    return this.pageType;
  }

  @Override
  public int stem() {
    return this.stem;
  }

  @Override
  public int post() {
    return this.post;
  }

  @Override
  public int zone() {
    return this.zone;
  }

  @Override
  public long base() {
    return this.base;
  }

  @Override
  public long span() {
    return this.span;
  }

  @Override
  public Value fold() {
    return this.fold;
  }

  @Override
  public STreePage page() {
    Object page = this.page;
    if (page instanceof WeakReference<?>) {
      page = ((WeakReference<?>) page).get();
    }
    if (page instanceof STreePage) {
      this.context.hitPage((STreePage) page);
      return (STreePage) page;
    } else {
      try (PageLoader pageLoader = this.context.openPageLoader(false)) {
        return (STreePage) pageLoader.loadPage(this);
      } catch (Throwable error) {
        if (Cont.isNonFatal(error)) {
          throw new StoreException(this.toDebugString(), error);
        } else {
          throw error;
        }
      }
    }
  }

  @Override
  public STreePage hardPage() {
    final Object page = this.page;
    if (page instanceof STreePage) {
      return (STreePage) page;
    } else {
      return null;
    }
  }

  @Override
  public STreePage softPage() {
    Object page = this.page;
    if (page instanceof WeakReference<?>) {
      page = ((WeakReference<?>) page).get();
    }
    if (page instanceof STreePage) {
      return (STreePage) page;
    } else {
      return null;
    }
  }

  @Override
  public long softVersion() {
    final STreePage page = this.softPage();
    if (page != null) {
      return page.version();
    } else {
      return 0L;
    }
  }

  @Override
  public boolean isEmpty() {
    return this.span == 0L;
  }

  @Override
  public boolean isCommitted() {
    return this.zone > 0 && this.base > 0L;
  }

  @Override
  public int pageRefSize() {
    int pageRefSize = this.pageRefSize;
    if (pageRefSize < 0) {
      pageRefSize = 5; // "@page"
      if (this.post != this.zone) {
        pageRefSize += 6; // "(post:"
        pageRefSize += Recon.sizeOf(Num.from(this.post));
      }
      pageRefSize += 6; // "[(,]zone:"
      pageRefSize += Recon.sizeOf(Num.from(this.zone));
      pageRefSize += 6; // ",base:"
      pageRefSize += Recon.sizeOf(Num.from(this.base));
      pageRefSize += 6; // ",size:"
      pageRefSize += Recon.sizeOf(Num.from(this.pageSize()));
      pageRefSize += 6; // ",area:"
      pageRefSize += Recon.sizeOf(Num.from(this.treeSize()));
      pageRefSize += 6; // ",span:"
      pageRefSize += Recon.sizeOf(Num.from(this.span));
      final Value fold = this.fold();
      if (fold.isDefined()) {
        pageRefSize += 6; // ",fold:"
        pageRefSize += Recon.sizeOf(fold);
      }
      pageRefSize += 1; // ')'
      this.pageRefSize = pageRefSize; // Must match bytes written by writePageRef
    }
    return pageRefSize;
  }

  @Override
  public int pageSize() {
    if (this.pageSize < 0) {
      this.page().memoizeSize(this);
    }
    return this.pageSize;
  }

  @Override
  public int diffSize() {
    if (this.diffSize < 0) {
      this.page().memoizeSize(this);
    }
    return this.diffSize;
  }

  @Override
  public long treeSize() {
    if (this.treeSize < 0L) {
      this.page().memoizeSize(this);
    }
    return this.treeSize;
  }

  @Override
  public Value toValue() {
    final Record header = Record.create(7);
    if (this.post != this.zone) {
      header.slot("post", this.post);
    }
    header.slot("zone", this.zone)
          .slot("base", this.base)
          .slot("size", this.pageSize())
          .slot("area", this.treeSize())
          .slot("span", this.span);
    final Value fold = this.fold();
    if (fold.isDefined()) {
      header.slot("fold", fold);
    }
    return Record.create(1).attr(this.pageType.tag(), header);
  }

  public STreePageRef reduced(Value identity, CombinerFunction<? super Value, Value> accumulator,
                              CombinerFunction<Value, Value> combiner, long newVersion) {
    if (!this.fold.isDefined()) {
      return this.page().reduced(identity, accumulator, combiner, newVersion).pageRef();
    } else {
      return this;
    }
  }

  @Override
  public STreePageRef evacuated(int post, long version) {
    if (this.post != 0 && this.post < post) {
      final STreePage page = this.page();
      try {
        return page.evacuated(post, version).pageRef();
      } catch (Throwable cause) {
        if (Cont.isNonFatal(cause)) {
          throw new StoreException(cause);
        } else {
          throw new StoreException(this.toDebugString(), cause);
        }
      }
    } else {
      return this;
    }
  }

  @Override
  public STreePageRef committed(int zone, long base, long version) {
    final STreePage page = this.hardPage();
    if (page != null) {
      return page.committed(zone, base, version).pageRef();
    } else {
      return this;
    }
  }

  @Override
  public STreePageRef uncommitted(long version) {
    final STreePage page = this.hardPage();
    if (page != null && page.version() >= version) {
      return page.uncommitted(version).pageRef();
    } else {
      return this;
    }
  }

  @Override
  public void writePageRef(Output<?> output) {
    Recon.write(output, this.toValue());
  }

  @Override
  public void writePage(Output<?> output) {
    this.page().writePage(output);
  }

  @Override
  public void writeDiff(Output<?> output) {
    this.page().writeDiff(output);
  }

  @Override
  public void buildDiff(Builder<Page, ?> builder) {
    this.page().buildDiff(builder);
  }

  @Override
  public STreePage setPageValue(Value value, boolean isResident) {
    final STreePage page = STreePage.fromValue(this, value);
    if (isResident) {
      this.page = page;
    } else {
      this.context.hitPage(page);
      this.page = new WeakReference<Object>(page);
    }
    return page;
  }

  @Override
  public STreePage loadPage(boolean isResident) {
    Object page = this.page;
    if (page instanceof WeakReference<?>) {
      page = ((WeakReference<?>) page).get();
    }
    if (page instanceof STreePage) {
      this.context.hitPage((STreePage) page);
      return (STreePage) page;
    } else {
      try (PageLoader pageLoader = this.context.openPageLoader(isResident)) {
        return (STreePage) pageLoader.loadPage(this);
      } catch (Throwable error) {
        if (Cont.isNonFatal(error)) {
          throw new StoreException(this.toDebugString(), error);
        } else {
          throw error;
        }
      }
    }
  }

  @Override
  public STreePage loadPage(PageLoader pageLoader) {
    Object page = this.page;
    if (page instanceof WeakReference<?>) {
      page = ((WeakReference<?>) page).get();
    }
    if (page instanceof STreePage) {
      this.context.hitPage((STreePage) page);
      return (STreePage) page;
    } else {
      try {
        return (STreePage) pageLoader.loadPage(this);
      } catch (Throwable error) {
        if (Cont.isNonFatal(error)) {
          throw new StoreException(this.toDebugString(), error);
        } else {
          throw error;
        }
      }
    }
  }

  @Override
  public STreePage loadTree(boolean isResident) {
    try (PageLoader pageLoader =  this.context.openPageLoader(isResident)) {
      return this.loadTree(pageLoader);
    }
  }

  @Override
  public STreePage loadTree(PageLoader pageLoader) {
    final STreePage page = this.loadPage(pageLoader);
    return page.loadTree(pageLoader);
  }

  @Override
  public void soften(long version) {
    final Object page = this.page;
    if (page instanceof STreePage) {
      if (((STreePage) page).version() <= version && this.isCommitted()) {
        this.context.hitPage((STreePage) page);
        this.page = new WeakReference<Object>(page);
      }
      ((STreePage) page).soften(version);
    }
  }

  @Override
  public Cursor<Slot> cursor() {
    return this.page().cursor();
  }

  public Cursor<Slot> depthCursor(int maxDepth) {
    if (maxDepth > 0) {
      return this.page().depthCursor(maxDepth);
    } else {
      final Value fold = this.fold();
      if (fold instanceof Record) {
        return new STreePageRefCursor(this, (Record) fold);
      } else if (fold.isDefined()) {
        return new STreePageRefCursor(this, Record.of(fold));
      } else {
        return new STreePageRefCursor(this, Record.empty());
      }
    }
  }

  public Cursor<Slot> deltaCursor(long sinceVersion) {
    return this.page().deltaCursor(sinceVersion);
  }

  @Override
  public String toString() {
    final Output<String> output = Unicode.stringOutput(this.pageRefSize());
    this.writePageRef(output);
    return output.bind();
  }

  public static STreePageRef empty(PageContext context, int stem, long version) {
    return STreeLeaf.empty(context, stem, version).pageRef();
  }

  public static STreePageRef fromValue(PageContext context, int stem, Value value) {
    Throwable cause = null;
    try {
      final String tag = value.tag();
      final PageType pageType = PageType.fromTag(tag);
      if (pageType == null) {
        return null;
      }
      final Value header = value.header(tag);
      final int zone = header.get("zone").intValue();
      final int post = header.get("post").intValue(zone);
      final long base = header.get("base").longValue();
      final int size = header.get("size").intValue();
      final long area = header.get("area").longValue();
      final long span = header.get("span").longValue();
      final Value fold = header.get("fold");
      if (base < 0L) {
        throw new StoreException("negative page base: " + base);
      } else if (size < 0) {
        throw new StoreException("negative page size: " + size);
      } else if (area < 0) {
        throw new StoreException("negative page area: " + area);
      } else if (span < 0) {
        throw new StoreException("negative page span: " + span);
      }
      return new STreePageRef(context, pageType, stem, post, zone, base, span,
                              fold, null, -1, size, 0, area);
    } catch (Throwable error) {
      if (Cont.isNonFatal(error)) {
        cause = error;
      } else {
        throw error;
      }
    }
    final Output<String> message = Unicode.stringOutput("Malformed stree page ref: ");
    Recon.write(message, value);
    throw new StoreException(message.bind(), cause);
  }

}
