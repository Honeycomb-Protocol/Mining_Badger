import { createSlice } from "@reduxjs/toolkit";

import * as actions from "../actions";
import type { AuthState } from "../types";

const initialState: AuthState = {
  refreshInventory: false,
  cookingAddresses: {},
};

export const slice = createSlice({
  name: "auth",
  initialState: () => initialState,
  reducers: {
    clearAuthData: (state) => {
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
  extraReducers: (builder) => {
    builder.addCase(actions.honeycomb.authenticate.pending, (state) => {
      state.authStatus = "pending";
      state.authLoader = true;
    });
    builder.addCase(
      actions.honeycomb.authenticate.fulfilled,
      (state, action) => {
        state.authStatus = "success";
        state.authToken = action.payload.token;
        state.authLoader = false;
        state.wallet = action.payload.wallet;
      }
    );
    builder.addCase(actions.honeycomb.authenticate.rejected, (state) => {
      state.authStatus = "failed";
      state.authLoader = false;
    });
    builder.addCase(actions.auth.logout.fulfilled, (state, action) => {
      state.authStatus = "loggedOut";
      state.authToken = null;
    });
  },
});

export const AuthActionsWithoutThunk = slice.actions;
export * as actions from "./actions";
export default slice.reducer;
