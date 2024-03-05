import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import {
  auth as authActions,
  honeycomb as honeycombActions,
} from "../store/actions";
import {
  Honeycomb,
  IdentityClient,
  IdentityModule,
  HoneycombUser,
  ForceScenario,
} from "@honeycomb-protocol/hive-control";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { HoneycombActionsWithoutThunk } from "../store/honeycomb";

export function useHoneycomb() {
  const dispatch = useAppDispatch();
  const {
    honeycomb,
    user,
    openWallet,
    isWalletUserFound,
    loadingModal,
    edgeClient,
  } = useSelector((state: RootState) => state.honeycomb);
  const {
    fetchUser: fetchingUser,
    fetchProfile: fetchingProfile,
    createUser: creatingUser,
    createProfile: creatingProfile,
    identity: identityLoading,
    honeycomb: honeycombLoading,
  } = useSelector((state: RootState) => state.honeycomb.loaders);
  const { authToken, userExists, authLoader, profileExists } = useSelector(
    (state: RootState) => state.auth
  );

  const identity = useMemo(() => honeycomb.identity(), [identityLoading]);

  const init = React.useCallback(() => {
    return dispatch(honeycombActions.initHoneycomb()).then(
      (x) => x.payload as Honeycomb
    );
  }, []);

  const fetchUser = React.useCallback(async () => {
    const user = await dispatch(honeycombActions.fetchUser()).then(
      (x) => x.payload as HoneycombUser
    );
    return user;
  }, []);

  const signInAndReloadAll = React.useCallback(async () => {
    await dispatch(honeycombActions.loadIdentityDeps("switch"));
  }, []);

  const authenticate = React.useCallback(
    async (identity?: void | IdentityModule) => {
      const { token } = await dispatch(
        honeycombActions.authenticate(identity)
      ).then((x) => x.payload as { token: string; user: HoneycombUser });
      return token;
    },
    []
  );

  const closeOrOpenModal = React.useCallback(
    (isOpen: boolean, isWalletUserFound: boolean = false) => {
      dispatch(
        HoneycombActionsWithoutThunk.setWallet({
          openWallet: isOpen,
          isWalletUserFound,
        })
      );
    },
    []
  );

  const setLoadingModal = React.useCallback((isOpen: boolean) => {
    dispatch(HoneycombActionsWithoutThunk.setLoadingModal(isOpen));
  }, []);

  const logout = React.useCallback((isAuthAgain: boolean = false) => {
    return dispatch(authActions.logout(isAuthAgain));
  }, []);

  const setIdentity = React.useCallback(async (wallet: WalletContextState) => {
    // console.log("Set Identity");
    // alert('Auth');

    const identity = await dispatch(honeycombActions.setIdentity(wallet)).then(
      (x) => x.payload as IdentityClient
    );
    // console.log("Identity", identity);
    return identity;
  }, []);

  const createUserAndProfile = React.useCallback(
    async (args: { username: string; bio: string; pfp: string | File }) => {
      const identity = await dispatch(
        honeycombActions.createUserAndProfile(args)
      ).then((x) => x.payload as IdentityModule);
      return identity;
    },
    []
  );

  const checkUsername = React.useCallback(
    async (username: string) => {
      if (!honeycomb) return;
      const publicInfo = await honeycomb.publicInfo(
        undefined,
        ForceScenario.Force
      );
      if (!publicInfo || !username) return false;
      let hcApiUrl = publicInfo.get("offchain");
      if (!hcApiUrl) throw new Error("offchain not found");
      if (hcApiUrl.charAt(-1) === "/") hcApiUrl = hcApiUrl.slice(0, -1);

      const {
        success,
        data: { available },
      }: {
        success: boolean;
        data: {
          username: string;
          available: boolean;
        };
      } = await honeycomb
        .http()
        .request(`${hcApiUrl}/auth/verify/username/${username}`, {
          method: "GET",
          withCredentials: true,
          authToken: authToken || "",
        });
      return success && available;
    },
    [honeycomb, authToken]
  );

  return {
    honeycomb,
    identity,
    user,
    authToken,
    authLoader,
    userExists,
    profileExists,
    signInAndReloadAll,
    creatingUser,
    fetchingUser,
    creatingProfile,
    fetchingProfile,
    openWallet,
    isWalletUserFound,
    loadingModal,
    honeycombLoading,
    init,
    authenticate,
    logout,
    setIdentity,
    fetchUser,
    checkUsername,
    closeOrOpenModal,
    setLoadingModal,
    createUserAndProfile,
    edgeClient,
  };
}
