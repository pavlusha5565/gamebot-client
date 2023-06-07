import { Shape } from "../types/utils/objects";
import { getErrorMessage } from "./Errors";

export function parseJwt<T>(token: string): T & { exp: number; iat: number } {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function applyObject<T extends object = Shape>(source: T, target: T): T {
  const keys = Object.keys(target) as Array<keyof T>;
  for (const key of keys) {
    source[key] = target[key];
  }
  return source;
}

export function tryParseJson<T = any>(
  json: string | null
): { data: T | null; error: string | null } {
  try {
    const parsed = JSON.parse(json || "null");
    return { data: parsed, error: null };
  } catch (err) {
    console.error("Ошибка в преобразовании json");
    return { data: null, error: getErrorMessage(err) };
  }
}
