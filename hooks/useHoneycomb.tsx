import React from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { inventory as InventoryActions } from "../store/actions";
import Utils from "@/lib/utils";

export function useHoneycomb() {
  const dispatch = useAppDispatch();
  const { claimFaucet } = Utils();
  // TODO: Do it later.

  // const { authLoader } = useSelector(
  //   (state: RootState) => state.auth
  // );

  const miningState = useSelector((state: RootState) => state.inventory);

  const refreshInventory = miningState?.refreshInventory;

  const faucetClaim = React.useCallback(async (resourceId: string) => {
    const isClaimed = await claimFaucet(resourceId);

    return isClaimed;
  }, []);

  const logout = React.useCallback(async () => {
    console.log("Logging out");
    await dispatch(InventoryActions.logout());
  }, []);

  return {
    // authLoader,
    refreshInventory,
    logout,
    faucetClaim,
  };
}
