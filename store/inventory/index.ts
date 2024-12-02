import { createSlice } from "@reduxjs/toolkit";

import type { InventoryState } from "../types";

const initialState: InventoryState = {
  refreshInventory: false,
  cookingAddresses: {},
};

export const slice = createSlice({
  name: "inventory",
  initialState: () => initialState,
  reducers: {
    clearInventoryData: (state) => {
      state.refreshInventory = initialState.refreshInventory;
    },
    setRefreshInventory: (state, action) => {
      state.refreshInventory = action.payload;
    },
    setCookingAddress: (state, action) => {
      state.cookingAddresses = {
        ...state.cookingAddresses,
        [action.payload.recipeAddress]: action.payload.cookingAddresses,
      };
    },
    remoreCookingAddress: (state, action) => {
      delete state.cookingAddresses[action.payload.recipeAddress];
    },
  },
});

export const InventoryActionsWithoutThunk = slice.actions;
export * as actions from "./actions";
export default slice.reducer;
