import { useContext, createContext } from "react";

export const AppContext = createContext(null);
export const CartOpenContext = createContext(null);
export const FailedMessageContext = createContext(null);
export const PermissionLevelContext = createContext(null);
export const LogoutErrorContext = createContext(null);
export const ItemAddedContext = createContext(null);
export const SelectedMainContext = createContext(null);
export const SelectedItemContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
};

export function useCartOpenContext() {
  return useContext(CartOpenContext);
}

export function useFailedMessageContext() {
  return useContext(FailedMessageContext);
}

export function usePermissionLevelContext() {
  return useContext(PermissionLevelContext);
}

export function useLogoutErrorContext() {
  return useContext(LogoutErrorContext);
}

export function useItemAddedContext() {
  return useContext(ItemAddedContext);
}

export function useSelectedMainContext() {
  return useContext(SelectedMainContext);
}

export function useSelectedItemContext() {
  return useContext(SelectedItemContext);
}