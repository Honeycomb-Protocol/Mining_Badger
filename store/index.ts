import { useDispatch } from "react-redux";
import inventoryReducer from "./inventory";
import {
  configureHoneycombStore,
  HoneycombRootState,
} from "@honeycomb-protocol/profile-hooks/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

import { InventoryState } from "@/interfaces";

export const store = configureHoneycombStore({
  reducers: { inventory: inventoryReducer },
  persistsWhitelist: ["inventory"],
});

export type RootState = HoneycombRootState<{
  inventory: InventoryState;
}>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<any>>; // Update to use ThunkDispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
