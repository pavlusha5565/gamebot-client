import { Shape } from "../../types/utils/objects";
import { RequestContext } from "./RequestContext";

export enum ERequestMethod {
  get = "GET",
  post = "POST",
  delete = "DELETE",
  put = "PUT",
  update = "UPDATE",
}

export interface IApiConfig {
  method: ERequestMethod;
  headers?: HeadersInit;
  query?: Shape;
  variables?: Shape;
}

export interface IResponseError {
  message: string;
  statusCode: number;
}

export interface IResponse<T = any> {
  data: T | null;
  error: IResponseError | null;
  status: number;
  statusText: string;
  headers: Headers;
  response: Response;
}

export type TApiMiddleware = (context: RequestContext) => Promise<void> | void;
