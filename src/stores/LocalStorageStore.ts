import { makeAutoObservable, toJS } from "mobx";
import { Shape } from "../types/utils/objects";
import { LOCAL_STORAGE_SESSION } from "../constants";
import { tryParseJson } from "../utils/object";

export class LocalStorageStore {
  subscribtion: string[] = [LOCAL_STORAGE_SESSION];
  _storage: Shape = {};

  localStorage = window.localStorage;

  constructor() {
    makeAutoObservable(this, {
      localStorage: false,
    });
  }

  subscribe(key: string | string[]) {
    const keys = Array.isArray(key) ? key : [key];

    for (const item of keys) {
      if (this.subscribtion.indexOf(item) === -1) {
        this.subscribtion.push(item);
      }
    }
  }

  unsubscribe(key: string | string[]) {
    const keys = Array.isArray(key) ? key : [key];

    for (const [index, item] of keys.entries()) {
      if (this.subscribtion.indexOf(item) === -1) {
        this.subscribtion.splice(index);
      }
    }
  }

  hundleUpdateLocalStore() {
    window.addEventListener("storage", this.handleStorageChange);
  }

  readStorage() {
    const items: Shape = {};
    this.subscribtion.forEach((item) => {
      items[item] = tryParseJson(this.localStorage.getItem(item));
      this._storage[item](items);
    });
  }

  setItem(key: string, value: any) {
    try {
      const data = JSON.stringify(value);
      this.localStorage.setItem(key, data);
    } catch (err) {
      // todo make normal error
      console.error(err);
    }
  }

  getItem<T>(key: string): T | null {
    const data = this.localStorage.getItem(key);
    return tryParseJson(data).data;
  }

  handleStorageChange = (e: StorageEvent) => {
    if (!e.key || this.subscribtion.indexOf(e.key) === -1) {
      return;
    }
    if (e.newValue === e.oldValue) {
      return;
    }

    const parsed = tryParseJson(e.newValue);

    if (!parsed.error) {
      this._storage[e.key] = parsed.data;
    }
  };

  get storage() {
    return toJS(this._storage);
  }
}

// @ts-ignore
window.localStorageStore = new LocalStorageStore();
