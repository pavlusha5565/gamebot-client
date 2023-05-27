import queryString from "query-string";
import { toJS } from "mobx";
import {
  ERequestMethod,
  IApiConfig,
  IResponse,
  IResponseError,
  TApiMiddleware,
} from "./Api.interfaces";
import { Shape } from "../../types/utils/objects";
import { RequestContext } from "./RequestContext";

export class Api {
  apiUrl: string = "";
  _configBase: RequestInit = {};
  _middlewares: TApiMiddleware[] = [];

  constructor(url: string, defaultConfig?: RequestInit) {
    this.apiUrl = url;
    this._configBase = defaultConfig || {};
  }

  async makeRequest<T>(
    url: string,
    config?: IApiConfig
  ): Promise<IResponse<T>> {
    const context = new RequestContext(
      this.queryStringUrl(this.apiEndpoint(url), config?.query),
      {
        method: config?.method || ERequestMethod.get,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          ...this._configBase.headers,
          ...(config?.headers || {}),
        },
      }
    );

    for (let i = 0; i < this._middlewares.length; i++) {
      const update = await this._middlewares[i](context, context.getContext);
      context.setContext(update);
    }

    const response = await fetch(context.url, context.getContext);
    return this.parseResponse(response);
  }

  async get<T>(
    url: string,
    options: Omit<IApiConfig, "method">
  ): Promise<IResponse<T>> {
    return await this.makeRequest<T>(url, {
      ...options,
      method: ERequestMethod.get,
    });
  }

  apiEndpoint(url: string, ...urls: string[]): string {
    let api = `${this.apiUrl}/${url}`;
    if (Array.isArray(urls)) {
      return api + "/" + urls.join("/");
    }
    return api;
  }

  applyMiddleware(middlewares: TApiMiddleware[]) {
    this._middlewares = middlewares;
  }

  deleteMiddleware(filterFunc: (input: TApiMiddleware[]) => TApiMiddleware[]) {
    this._middlewares = filterFunc(this._middlewares);
  }

  updateConfig(config: RequestInit) {
    this._configBase = {
      ...this._configBase,
      ...config,
    };
  }

  async parseResponse<T>(response: Response): Promise<IResponse<T>> {
    let data = null;
    let error = null;

    if (response.ok) {
      data = (await response.json()) as T;
    } else {
      error = (await response.json()) as IResponseError;
    }

    return {
      data: data,
      error: error,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      response: response,
    };
  }

  queryStringUrl(url: string, params?: Shape) {
    if (!params) {
      return url;
    }
    const queries = queryString.parseUrl(url);
    return queryString.stringifyUrl({
      url: queries.url,
      query: {
        ...queries.query,
        ...(params || {}),
      },
    });
  }

  get middlewares() {
    return toJS(this._middlewares);
  }
}
