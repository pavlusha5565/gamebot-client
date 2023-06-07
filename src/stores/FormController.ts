import { makeAutoObservable, runInAction, toJS } from "mobx";

export interface IRegisterOption {
  defailtValue: any;
}

export class FormController<T extends Record<string, string>> {
  _data: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
  }

  onChange(name: keyof T) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      this.setState({
        [name]: value,
      });
    };
  }

  setState(update: Record<string, string>) {
    runInAction(() => {
      this._data = {
        ...this.data,
        ...update,
      };
    });
  }

  register(name: string, options: IRegisterOption) {
    if (!this.data[name]) {
      this._data = {
        ...this.data,
        [name]: options.defailtValue || "",
      };
    }

    return {
      value: this._data[name],
      onChange: this.onChange(name),
    };
  }

  get data(): Record<string, string> {
    return toJS(this._data);
  }
}
