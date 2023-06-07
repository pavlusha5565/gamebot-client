import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { IResponseError } from "../Api/Api.interfaces";

export class RequestStore<T extends object> {
  _data: T | null = null;
  _error: IResponseError | null = null;
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      _data: observable,
      _error: observable,
      isLoading: observable,

      setData: action,
      setError: action,
      setLoading: action,

      error: computed,
      loading: computed,
      data: computed,
    });
  }

  setData(data: T | null) {
    runInAction(() => {
      if (!data) {
        this._data = null;
        return;
      }

      this._data = {
        ...this.data,
        ...data,
      };
    });
  }

  setError(error: IResponseError) {
    this._error = error;
  }

  setLoading(nextState: boolean) {
    this.isLoading = nextState;
  }

  get loading(): boolean {
    return this.isLoading;
  }

  get error(): IResponseError | null {
    return toJS(this._error);
  }

  get data(): T | null {
    return toJS(this._data);
  }
}
