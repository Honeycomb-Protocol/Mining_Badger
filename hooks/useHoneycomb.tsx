import React from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import {
  honeycomb as honeycombActions,
  auth as AuthActions,
} from "../store/actions";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Profile, User } from "@honeycomb-protocol/edge-client";

export function useHoneycomb() {
  const dispatch = useAppDispatch();
  const { user, edgeClient, wallet, profile } = useSelector(
    (state: RootState) => state.honeycomb
  );
  const {
    loaders: {
      fetchUser: fetchingUser,
      fetchProfile: fetchingProfile,
      createUser: creatingUser,
      createProfile: creatingProfile,
      honeycomb: honeycombLoading,
      fetchUserNfts: fetchingNfts,
    },
    userApiCalled,
    profileApiCalled,
  } = useSelector((state: RootState) => state.honeycomb);
  const { authToken, authLoader, refreshInventory } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchUser = React.useCallback(async () => {
    const user = await dispatch(honeycombActions.fetchUser()).then(
      (x) => x.payload as User
    );
    return user;
  }, []);

  const fetchProfile = React.useCallback(async () => {
    const profile = await dispatch(honeycombActions.fetchProfile()).then(
      (x) => x.payload as User
    );
    return profile;
  }, []);

  const setWallet = React.useCallback(async (wallet: WalletContextState) => {
    // console.log("Set Wallet");
    // alert('Auth');

    const walletContext = await dispatch(
      honeycombActions.setWallet(wallet)
    ).then((x) => x.payload as WalletContextState);
    // console.log("Wallet", walletContext);
    return walletContext;
  }, []);

  const createUserAndProfile = React.useCallback(
    async (args: { username: string; bio: string; pfp: string | File }) => {
      console.log("checking create user and profile");
      const identity = await dispatch(
        honeycombActions.createUserAndProfile(args)
      ).then((x) => x.payload as User);
      return identity;
    },
    []
  );

  const createUser = React.useCallback(
    async (args: { username: string; bio: string; pfp: string | File }) => {
      const identity = await dispatch(honeycombActions.createUser(args)).then(
        (x) => x.payload as User
      );
      return identity;
    },
    []
  );

  const createProfile = React.useCallback(
    async (args: { name: string; bio: string; pfp: string | File }) => {
      const identity = await dispatch(
        honeycombActions.createProfile(args)
      ).then((x) => x.payload as Profile);
      return identity;
    },
    []
  );

  const updateProfile = React.useCallback(
    async (args: { name?: string; bio?: string; pfp?: string | File }) => {
      const identity = await dispatch(honeycombActions.updateProfile(args));
      return identity;
    },
    []
  );

  const loadIdentityDeps = React.useCallback(async () => {
    const status = await dispatch(honeycombActions.loadIdentityDeps()).then(
      (x) => x.payload as boolean
    );
    return status;
  }, []);

  const logout = React.useCallback(async () => {
    await dispatch(AuthActions.logout());
  }, []);

  return {
    user,
    profile,
    creatingUser,
    fetchingUser,
    creatingProfile,
    fetchingProfile,
    honeycombLoading,
    fetchingNfts,
    loadIdentityDeps,
    createUser,
    createProfile,
    updateProfile,
    setWallet,
    fetchUser,
    fetchProfile,
    edgeClient,
    wallet,
    createUserAndProfile,
    authLoader,
    authToken,
    refreshInventory,
    userApiCalled,
    profileApiCalled,
    logout,
  };
}
