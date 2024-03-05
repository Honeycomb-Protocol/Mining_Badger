import { Honeycomb } from "@honeycomb-protocol/hive-control";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import createEdgeClient, { User } from "@honeycomb-protocol/edge-client/client";

import { EDGE_CLIENT, connection } from "../../config/config.js";
import * as actions from "../actions";
import { HoneycombState } from "../types.js";

const initialState: HoneycombState = {
  honeycomb: new Honeycomb(connection, {
    env: process.env.NEXT_PUBLIC_HPL_ENV || "main",
    confirmOptions: {
      commitment: "processed",
      preflightCommitment: "processed",
    },
  }),
  edgeClient: createEdgeClient(
    new Client({
      url: EDGE_CLIENT,
      exchanges: [cacheExchange, fetchExchange],
    })
  ),
  projects: {},
  openWallet: false,
  loadingModal: false,
  isWalletUserFound: false,
  user: null,
  loaders: {
    honeycomb: true,
    identity: false,
    projects: false,
    fetchUser: false,
    createUser: false,
    loadIdentityDeps: false,
  },
};

export const slice = createSlice({
  name: "honeycomb",
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{
        openWallet: boolean;
        isWalletUserFound?: boolean;
      }>
    ) => {
      state.openWallet = action.payload.openWallet;
      state.isWalletUserFound = action.payload.isWalletUserFound || false;
    },
    setLoadingModal: (state, action: PayloadAction<boolean>) => {
      state.loadingModal = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.honeycomb.initHoneycomb.pending, (state) => {
      state.loaders = { ...state.loaders, honeycomb: true };
      state.loaders = { ...state.loaders, projects: true };
    });
    builder.addCase(
      actions.honeycomb.initHoneycomb.fulfilled,
      (state, action) => {
        state.honeycomb = action.payload;
        state.projects = action.payload._projects;
        state.loaders = { ...state.loaders, honeycomb: false };
        state.loaders = { ...state.loaders, projects: false };
      }
    );
    builder.addCase(actions.honeycomb.initHoneycomb.rejected, (state) => {
      state.loaders = { ...state.loaders, honeycomb: false };
      state.loaders = { ...state.loaders, projects: false };
    });

    builder.addCase(actions.honeycomb.setIdentity.pending, (state) => {
      state.loaders = { ...state.loaders, identity: true };
    });
    builder.addCase(
      actions.honeycomb.setIdentity.fulfilled,
      (state, action) => {
        state.loaders = { ...state.loaders, identity: false };
      }
    );
    builder.addCase(actions.honeycomb.setIdentity.rejected, (state) => {
      state.loaders = { ...state.loaders, identity: false };
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
      state.user = action.payload;
      state.loaders = { ...state.loaders, fetchUser: false };
    });
    builder.addCase(actions.honeycomb.fetchUser.rejected, (state) => {
      state.loaders = { ...state.loaders, fetchUser: false };
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
  },
});

export const HoneycombActionsWithoutThunk = slice.actions;
export * as actions from "./actions";
export default slice.reducer;
