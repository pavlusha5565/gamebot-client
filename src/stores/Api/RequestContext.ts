const requestDefault: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
};

export class RequestContext {
  url: string = "";
  context: RequestInit = requestDefault;

  constructor(url: string, init: RequestInit) {
    this.context = {
      ...init,
    };
    this.url = url;
  }

  async setContext(context: RequestInit | null | undefined) {
    this.context = {
      ...this.context,
      ...(context || {}),
    };
  }

  async setHeaders(headers: HeadersInit) {
    this.context.headers = {
      ...this.context.headers,
      ...headers,
    };
  }

  get getContext() {
    return this.context;
  }
}
