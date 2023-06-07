import { AuthStore } from "../../AuthStore";
import { TApiMiddleware } from "../Api.interfaces";
import { RequestContext } from "../RequestContext";

export function createSetAccessTokenContextLink(
  authStore: AuthStore
): TApiMiddleware {
  return (context: RequestContext) => {
    if (!authStore.authToken) {
      throw new Error("Ошибка авторизации");
    }
    const authToken = authStore.authToken;
    if (authToken) {
      context.setHeaders({
        Authorization: "Bearer " + authToken,
      });
    }
  };
}
