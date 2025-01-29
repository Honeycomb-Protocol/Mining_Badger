import React from "react";
import { useAppDispatch } from "../store";
import { inventory as InventoryActions } from "../store/actions";

export function useHoneycomb() {
  const dispatch = useAppDispatch();

  const logout = React.useCallback(async () => {
    await dispatch(InventoryActions.logout());
  }, []);

  return {
    logout,
  };
}
