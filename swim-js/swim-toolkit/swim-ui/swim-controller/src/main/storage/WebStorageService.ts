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

import {Lazy} from "@swim/util";
import {StorageService} from "./StorageService";

/** @public */
export class WebStorageService extends StorageService {
  constructor(storage: Storage) {
    super();
    this.storage = storage;
    this.onStorage = this.onStorage.bind(this);
  }

  readonly storage: Storage;

  override get(key: string): string | undefined {
    const value = this.storage.getItem(key);
    return value !== null ? value : void 0;
  }

  override set(key: string, newValue: string | undefined): string | undefined {
    let oldValue: string | null | undefined = this.storage.getItem(key);
    if (oldValue === null) {
      oldValue = void 0;
    }
    if (newValue !== oldValue) {
      this.willSet(key, newValue, oldValue);
      if (newValue !== void 0) {
        this.storage.setItem(key, newValue);
      } else {
        this.storage.removeItem(key);
      }
      this.onSet(key, newValue, oldValue);
      this.didSet(key, newValue, oldValue);
    }
    return oldValue;
  }

  override clear(): void {
    this.willClear();
    this.storage.clear();
    this.onClear();
    this.didClear();
  }

  /** @internal */
  onStorage(event: StorageEvent): void {
    if (event.storageArea === this.storage) {
      const key = event.key;
      if (key !== null) {
        let newValue: string | null | undefined = event.newValue;
        if (newValue === null) {
          newValue = void 0;
        }
        let oldValue: string | null | undefined = event.oldValue;
        if (oldValue === null) {
          oldValue = void 0;
        }
        if (newValue !== oldValue) {
          this.willSet(key, newValue, oldValue);
          this.onSet(key, newValue, oldValue);
          this.didSet(key, newValue, oldValue);
        }
      } else {
        this.willClear();
        this.onClear();
        this.didClear();
      }
    }
  }

  protected override onMount(): void {
    super.onMount();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", this.onStorage);
    }
  }

  protected override onUnmount(): void {
    super.onUnmount();
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", this.onStorage);
    }
  }

  @Lazy
  static local(): WebStorageService | null {
    try {
      return new WebStorageService(window.localStorage);
    } catch (e) {
      return null;
    }
  }

  @Lazy
  static session(): WebStorageService | null {
    try {
      return new WebStorageService(window.sessionStorage);
    } catch (e) {
      return null;
    }
  }
}
