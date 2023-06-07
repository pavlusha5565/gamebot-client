import { AuthStore } from "../../AuthStore";
import { TApiMiddleware } from "../Api.interfaces";
import { RequestContext } from "../RequestContext";

export function refetchAccessToken(authStore: AuthStore): TApiMiddleware {
  return async (context: RequestContext) => {
    if (!authStore.isAuth) {
      await authStore.updateAuth();
    }
  };
}
