import React from "react";
import { AuthStore } from "./AuthStore";
import { apiUrl } from "../config";
import { Api } from "./Api/Api";

export interface IStoreContext {
  apiClient: Api;
  authStore: AuthStore;
}

const authStore = new AuthStore();
const apiWithAuth = new Api(apiUrl);

apiWithAuth.applyMiddleware([
  waitUntilTokenUpdate(authStore),
  setAuthHeader(authStore),
]);

const stores = {
  apiClient: apiWithAuth,
  authStore: authStore,
};

// @ts-ignore
window.stores = stores;

export const StoreContext = React.createContext<IStoreContext>(stores);

export function StoreProvider({ children }: { children: React.ReactElement }) {
  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
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
