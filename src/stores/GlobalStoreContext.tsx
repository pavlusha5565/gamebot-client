import React from "react";
import { AuthStore } from "./AuthStore";
import { apiUrl } from "../config";
import { Api } from "./Api/Api";
import { LocalStorageStore } from "./LocalStorageStore";
import { createSetAccessTokenContextLink } from "./Api/middlewares/setAccessTokenContext";
import { refetchAccessToken } from "./Api/middlewares/refetchAccessToken";

export interface IStoreContext {
  apiClient: Api;
  authStore: AuthStore;
  localStorageStore: LocalStorageStore;
}

const authStore = new AuthStore();
const apiWithAuth = new Api(apiUrl);
apiWithAuth.applyMiddleware([
  refetchAccessToken(authStore),
  createSetAccessTokenContextLink(authStore),
]);
const localStorageStore = new LocalStorageStore();

apiWithAuth.applyMiddleware([]);

export const globalStores: IStoreContext = {
  apiClient: apiWithAuth,
  authStore: authStore,
  localStorageStore: localStorageStore,
};

// @ts-ignore
window.stores = globalStores;

export const StoreContext = React.createContext<IStoreContext>(globalStores);

export function StoreProvider({ children }: { children: React.ReactElement }) {
  return (
    <StoreContext.Provider value={globalStores}>
      {children}
    </StoreContext.Provider>
  );
}

export function useGlobalStore(): IStoreContext {
  return React.useContext<IStoreContext>(StoreContext);
}

export function useStore<T extends IStoreContext[keyof IStoreContext]>(
  store: keyof IStoreContext
): T {
  return React.useContext<IStoreContext>(StoreContext)[store] as T;
}
