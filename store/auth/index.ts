import * as actions from "../actions";
import type { AuthState } from "../types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  authStatus: null,
  authLoader: false,
  authToken: null,
  refreshInventory: false,
  wallet: null,
};

export const slice = createSlice({
  name: "auth",
  initialState: () => initialState,
  reducers: {
    clearAuthData: (state) => {
      state.authStatus = initialState.authStatus;
      state.authLoader = initialState.authLoader;
      state.authToken = initialState.authToken;
      state.refreshInventory = initialState.refreshInventory;
      state.wallet = initialState.wallet;
    },
    setRefreshInventory: (state, action) => {
      state.refreshInventory = action.payload;
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
