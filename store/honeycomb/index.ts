import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import createEdgeClient, { User } from "@honeycomb-protocol/edge-client/client";

import { EDGE_CLIENT, connection } from "../../config/config.js";
import * as actions from "../actions";
import { HoneycombState } from "../types.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

const initialState: HoneycombState = {
  wallet: null,
  edgeClient: createEdgeClient(
    new Client({
      url: EDGE_CLIENT,
      exchanges: [fetchExchange],
    })
  ),
  user: null,
  profile: null,
  loaders: {
    wallet: false,
    fetchUser: false,
    fetchProfile: false,
    createUser: false,
    createProfile: false,
    updateProfile: false,
    loadIdentityDeps: false,
    fetchUserNfts: false,
  },
  userApiCalled: false,
  profileApiCalled: false,
};

export const slice = createSlice({
  name: "honeycomb",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    clearUserApiCalled: (state) => {
      state.userApiCalled = false;
    },
    clearProfileApiCalled: (state) => {
      state.profileApiCalled = false;
    },
    resetStates: (state) => {
      state.user = null;
      state.profile = null;
      state.userApiCalled = false;
      state.profileApiCalled = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.honeycomb.setWallet.pending, (state) => {
      state.loaders = { ...state.loaders, wallet: true };
    });
    builder.addCase(actions.honeycomb.setWallet.fulfilled, (state, action) => {
      state.loaders = { ...state.loaders, wallet: false };
      // @ts-ignore
      state.wallet = action.payload;
    });
    builder.addCase(actions.honeycomb.setWallet.rejected, (state) => {
      state.loaders = { ...state.loaders, wallet: false };
    });

    builder.addCase(actions.honeycomb.loadIdentityDeps.pending, (state) => {
      state.loaders = { ...state.loaders, loadIdentityDeps: true };
    });
    builder.addCase(
      actions.honeycomb.loadIdentityDeps.fulfilled,
      (state, action) => {
        state.loaders = { ...state.loaders, loadIdentityDeps: false };
      }
    );
    builder.addCase(actions.honeycomb.loadIdentityDeps.rejected, (state) => {
      state.loaders = { ...state.loaders, loadIdentityDeps: false };
    });

    builder.addCase(actions.honeycomb.fetchUser.pending, (state) => {
      state.loaders = { ...state.loaders, fetchUser: true };
    });
    builder.addCase(actions.honeycomb.fetchUser.fulfilled, (state, action) => {
      console.log("sadkas");
      state.user = action.payload;
      state.userApiCalled = true;
      state.loaders = { ...state.loaders, fetchUser: false };
    });
    builder.addCase(actions.honeycomb.fetchUser.rejected, (state, action) => {
      state.user = null;
      state.userApiCalled = true;
      state.loaders = { ...state.loaders, fetchUser: false };
    });
    builder.addCase(actions.honeycomb.fetchProfile.pending, (state) => {
      state.loaders = { ...state.loaders, fetchProfile: true };
    });
    builder.addCase(
      actions.honeycomb.fetchProfile.fulfilled,
      (state, action) => {
        state.profile = action.payload;
        state.profileApiCalled = true;
        state.loaders = { ...state.loaders, fetchProfile: false };
      }
    );
    builder.addCase(actions.honeycomb.fetchProfile.rejected, (state) => {
      state.profile = null;
      state.profileApiCalled = true;
      state.loaders = { ...state.loaders, fetchProfile: false };
    });

    builder.addCase(actions.honeycomb.createUserAndProfile.pending, (state) => {
      state.loaders = { ...state.loaders, createUser: true };
    });
    builder.addCase(
      actions.honeycomb.createUserAndProfile.fulfilled,
      (state, action) => {
        state.loaders = { ...state.loaders, createUser: false };
      }
    );
    builder.addCase(
      actions.honeycomb.createUserAndProfile.rejected,
      (state) => {
        state.loaders = { ...state.loaders, createUser: false };
      }
    );

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
    builder.addCase(actions.honeycomb.updateProfile.pending, (state) => {
      state.loaders = { ...state.loaders, updateProfile: true };
    });
    builder.addCase(
      actions.honeycomb.updateProfile.fulfilled,
      (state, action) => {
        state.loaders = { ...state.loaders, updateProfile: false };
      }
    );
    builder.addCase(actions.honeycomb.updateProfile.rejected, (state) => {
      state.loaders = { ...state.loaders, updateProfile: false };
    });
  },
});

export const HoneycombActionsWithoutThunk = slice.actions;
export * as actions from "./actions";
export default slice.reducer;
