import { apiUrl } from "../config";

export function makeApiEndpoint(url: string, ...urls: string[]): string {
  let api = `${apiUrl}/${url}`;
  if (Array.isArray(urls)) {
    return api + "/" + urls.join("/");
  }
  return api;
}

export interface IResponse<T = any> {
  data: T | null;
  status: number;
  statusText: string;
  headers: Headers;
  response: Response;
}

export async function request<T>(
  url: string,
  body?: object,
  configProps: RequestInit = {}
): Promise<IResponse<T>> {
  const config: RequestInit = {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      ...(configProps?.headers || {}),
    },
    body: JSON.stringify(body),
    ...configProps,
  };
  const response = await fetch(makeApiEndpoint(url), config);
  const data = (await response.json()) as T;

  return {
    data: response.ok ? data : null,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    response: response,
  };
}

function makeRequest(method: RequestInit["method"]) {
  return <T>(url: string, body?: any, config: RequestInit = {}) =>
    request<T>(url, body, { ...config, method: method });
}

export const api = {
  get: makeRequest("get"),
  post: makeRequest("post"),
  delete: makeRequest("delete"),
};
