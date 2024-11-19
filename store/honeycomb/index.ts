import { createSlice } from "@reduxjs/toolkit";

import * as actions from "../actions";
import { HoneycombState } from "../types.js";

const initialState: HoneycombState = {
  loaders: {
    fetchUserNfts: false,
  },
  userApiCalled: false,
  profileApiCalled: false,
};

export const slice = createSlice({
  name: "honeycomb",
  initialState,
  reducers: {
    clearUserApiCalled: (state) => {
      state.userApiCalled = false;
    },
    clearProfileApiCalled: (state) => {
      state.profileApiCalled = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.honeycomb.createUser.pending, (state) => {
      state.loaders = { ...state.loaders, createUser: true };
    });
    builder.addCase(actions.honeycomb.createUser.fulfilled, (state, action) => {
      state.loaders = { ...state.loaders, createUser: false };
    });
    builder.addCase(actions.honeycomb.createUser.rejected, (state) => {
      state.loaders = { ...state.loaders, createUser: false };
    });
    builder.addCase(actions.honeycomb.createProfile.pending, (state) => {
      state.loaders = { ...state.loaders, createProfile: true };
    });
    builder.addCase(
      actions.honeycomb.createProfile.fulfilled,
      (state, action) => {
        state.loaders = { ...state.loaders, createProfile: false };
      }
    );
    builder.addCase(actions.honeycomb.createProfile.rejected, (state) => {
      state.loaders = { ...state.loaders, createProfile: false };
    });
  },
});

export const HoneycombActionsWithoutThunk = slice.actions;
export * as actions from "./actions";
export default slice.reducer;
