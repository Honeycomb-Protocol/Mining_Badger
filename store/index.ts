import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import type { InventoryState } from "./types";
import inventoryReducer from "./inventory";
import { useDispatch } from "react-redux";
import {
  configureHoneycombStore,
  HoneycombRootState,
} from "@honeycomb-protocol/profile-hooks/store";


export const store = configureHoneycombStore({
  reducers: { inventory: inventoryReducer },
  persistsWhitelist: ["inventory"],
});
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   devTools: true,
// });


export type RootState = HoneycombRootState<{
  inventory: InventoryState;
}>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<any>>; // Update to use ThunkDispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
