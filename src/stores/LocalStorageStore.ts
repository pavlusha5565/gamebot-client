import { makeAutoObservable, toJS } from "mobx";
import { Shape } from "../types/utils/objects";

export class LocalStorageStore {
  subscribtion: string[] = [];
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

  get storage() {
    return toJS(this._storage);
  }
}

// @ts-ignore
window.localStorageStore = new LocalStorageStore();
