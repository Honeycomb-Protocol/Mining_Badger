import {
  Honeycomb,
  HoneycombFile,
  HoneycombProject,
  IdentityClient,
  IdentityModule,
  HoneycombUser,
  guestIdentity,
  toHoneycombFile,
  walletIdentity,
  isWallet,
  ForceScenario,
} from "@honeycomb-protocol/hive-control";
import base58 from "bs58";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { User } from "@honeycomb-protocol/edge-client";

import type { AsyncActions } from "../actions/types.js";
import type { HoneycombState } from "../types.js";
import { HPL_PROJECT } from "../../config/config.js";

const actionFactory = (actions: AsyncActions) => {
  const initHoneycomb = createAsyncThunk<Honeycomb, void>(
    "honeycomb/init",
    async (_, { rejectWithValue, fulfillWithValue, getState, dispatch }) => {
      try {
        const { honeycomb } = (getState() as { honeycomb: HoneycombState })
          .honeycomb;

        // @ts-ignore
        window.honeycomb = honeycomb;
        // @ts-ignore
        honeycomb.use(
          await HoneycombProject.fromAddress(honeycomb, HPL_PROJECT)
        );

        await dispatch(loadIdentityDeps("init"));

        return fulfillWithValue(honeycomb);
      } catch (error) {
        // Handle any errors if necessary
        console.error("Error initializing honeycomb:", error);
        throw rejectWithValue(error);
      }
    }
  );
  const loadIdentityDeps = createAsyncThunk<boolean, "init" | "switch">(
    "honeycomb/loadIdentityDeps",
    async (calledFrom, { getState, dispatch }) => {
      const { honeycomb, loaders } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;

      let identity = honeycomb.identity() as IdentityClient;
      if ((loaders.honeycomb && calledFrom !== "init") || identity.isGuest) {
        return false;
      }

      await dispatch(authenticate(honeycomb.identity()));
      return true;
    }
  );

  const setIdentity = createAsyncThunk<IdentityClient, WalletContextState>(
    "honeycomb/identity",
    async (
      wallet,
      { rejectWithValue, fulfillWithValue, getState, dispatch }
    ) => {
      const isGuest = !isWallet(wallet);
      const { honeycomb, loaders } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;
      if (
        (isGuest && honeycomb.identity().isGuest) ||
        loaders.loadIdentityDeps
      ) {
        return fulfillWithValue(honeycomb.identity() as IdentityClient);
      }
      if (honeycomb.identity().address.equals(wallet.publicKey)) {
        return fulfillWithValue(honeycomb.identity() as IdentityClient);
      }
      try {
        const identityConfig: any = !isGuest && {
          publicKey: wallet.publicKey,
          signMessage: (msg) => {
            return wallet.signMessage(msg);
          },
          signTransaction: wallet.signTransaction as any,
          signAllTransactions: wallet.signAllTransactions as any,
        };
        const identity = !isGuest
          ? walletIdentity(identityConfig)
          : guestIdentity();
        honeycomb.use(identity);

        if (!isGuest) {
          await dispatch(loadIdentityDeps("switch"));
        }

        return fulfillWithValue(identity);
      } catch (error) {
        // Handle any errors that may occur during wallet connection
        console.error("Error injecting wallet to honeycomb:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const fetchUser = createAsyncThunk<User>(
    "honeycomb/fetchUser",
    async (_, { fulfillWithValue, rejectWithValue, dispatch, getState }) => {
      const { honeycomb, edgeClient } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;
      const identity = honeycomb.identity() as IdentityClient;
      try {
        const user = await edgeClient
          .fetchUsers({
            wallets: [identity.address.toString()],
          })
          .then((data) => {
            if (!data || !data.user.length) {
              dispatch(actions.auth.logout(true));
              return rejectWithValue("User not found");
            }
            return data.user[0];
          })
          .catch((e) => {
            console.error("Error fetching user:", e);
            throw rejectWithValue(e);
          });

        return fulfillWithValue(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const createUserAndProfile = createAsyncThunk<
    HoneycombUser,
    { username: string; bio: string; pfp: string | File }
  >(
    "honeycomb/createUserAndProfile",
    async (args, { rejectWithValue, fulfillWithValue, getState }) => {
      const { honeycomb, edgeClient } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;
      const identity = honeycomb.identity() as IdentityClient;
      try {
        if (!identity) {
          return rejectWithValue("No identity found");
        }

        let pfp: string | HoneycombFile = args.pfp as any;
        let uploading = false;
        if (pfp && pfp instanceof File) {
          pfp = toHoneycombFile(await pfp.arrayBuffer(), "pfp.png");
          uploading = true;
        }

        const toastId = toast.loading(
          uploading
            ? "Uploading Pfp & Creating User Profile..."
            : "Creating User Profile...",
          { progress: 0 }
        );

        const [userAddress] = honeycomb.pda().hiveControl().user(args.username);

        const { shadowSignerKey } = await edgeClient.getShadowSignerKey({
          user: userAddress.toString(),
        });

        const profilePromise = honeycomb.profiles().newUser({
          shadowSigner: new PublicKey(shadowSignerKey),
          username: args.username,
          name: args.username,
          bio: args.bio,
          pfp,
          createProfileFor: honeycomb.project(),
        });

        const user = await profilePromise
          .then((createdProfile) => {
            toast.update(toastId, {
              autoClose: 5000,
              type: "success",
              render: "Profile Creation Successful!!",
              progress: 1,
            });
            return createdProfile;
          })
          .catch((e) => {
            console.error(
              "an unexpected error occured while creating User Profile",
              e
            );
            toast.update(toastId, {
              autoClose: 5000,
              type: "error",
              render: "an unexpected error occured while creating User Profile",
              progress: 1,
            });
            throw rejectWithValue(e);
          });

        return fulfillWithValue(user);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const authenticate = createAsyncThunk<
    { token: string; user: User },
    IdentityModule | void
  >(
    "honeycomb/authenticate",
    async (
      ident,
      { rejectWithValue, fulfillWithValue, getState, dispatch }
    ) => {
      // alert("honeycomb/authenticate")
      const { honeycomb, edgeClient } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;
      const identity = ident || (honeycomb.identity() as IdentityModule);

      //todo : need to verify the token expiry here

      // const {
      //   auth: { authToken },
      //   honeycomb: { user },
      // } = getState() as { auth: AuthState; honeycomb: HoneycombState };

      // if (authToken) {
      //   let fetchedUser: any = user;
      //   if (!fetchedUser) {
      //     fetchedUser = await dispatch(fetchUser());
      //   }

      //   return fulfillWithValue({
      //     token: authToken,
      //     user: fetchedUser,
      //   });
      // }

      try {
        const userExists = await identity
          .walletResolver(ForceScenario.Force)
          .then((user) => {
            if (!user) return false;
            return true;
          })
          .catch((e) => {
            console.log("Error resolving wallet:", e);
            return false;
            // console.error("Error resolving wallet:", e);
          });
        dispatch({
          type: "auth/setUserExists",
          payload: userExists,
        });

        if (!userExists) {
          return rejectWithValue("User does not exist");
        }

        const res = await edgeClient.authRequest({
          wallet: identity.address.toString(),
        });

        const message = new TextEncoder().encode(res.authRequest);
        const sig = await identity.signMessage(message);
        const signature = base58.encode(sig);

        const {
          authConfirm: { accessToken: token, user },
        } = await edgeClient.authConfirm({
          signature: signature,
          wallet: identity.address.toString(),
        });

        await dispatch(fetchUser());

        return fulfillWithValue({ token, user });
      } catch (error) {
        console.error("Error authenticating", error);
        return rejectWithValue(error);
      }
    }
  );

  return {
    initHoneycomb,
    setIdentity,
    fetchUser,
    authenticate,
    loadIdentityDeps,
    createUserAndProfile,
  };
};
export default actionFactory;
