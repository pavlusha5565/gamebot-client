import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from "mobx";

type TUpdateState<T> = Partial<T> | TUpdateFunction<T>;
type TUpdateFunction<T> = (data: Partial<T>) => Partial<T>;

export class BehaviorStore<T extends object> {
  _data: Partial<T> = {};

  constructor() {
    makeObservable(this, {
      _data: observable,

      setData: action,
      updateData: action,

      data: computed,
    });
  }

  setData(update: T) {
    runInAction(() => {
      this._data = update;
    });
  }

  // Ummutable update action
  updateData(update: Partial<T> | TUpdateState<T>) {
    runInAction(() => {
      const data = this.data;

      if (typeof update === "function") {
        this._data = {
          ...data,
          ...update(data),
        };
      } else {
        this._data = {
          ...data,
          ...update,
        };
      }
    });
  }

  get data(): Partial<T> {
    return toJS(this._data);
  }
}
