import React from "react";
import { AuthStore } from "./AuthStore";

export interface IStoreContext {
  authStore: AuthStore;
}

const stores = {
  authStore: new AuthStore(),
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

export function useStore(store: keyof IStoreContext) {
  return React.useContext<IStoreContext>(StoreContext)[store];
}
