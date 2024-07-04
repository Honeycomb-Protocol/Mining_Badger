import { honeycomb } from "./../actions/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  User,
  Profile,
  SendBulkTransactionsQuery,
} from "@honeycomb-protocol/edge-client";
import type { AsyncActions } from "../actions/types.js";
import type { AuthState, HoneycombState } from "../types.js";
import { API_URL, HPL_PROJECT, PAYER_DRIVER } from "../../config/config.js";
import base58 from "bs58";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { HoneycombActionsWithoutThunk } from ".";
import axios from "axios";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const actionFactory = (actions: AsyncActions) => {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
    "processed"
  );
  const setWallet = createAsyncThunk<WalletContextState, WalletContextState>(
    "honeycomb/identity",
    async (wallet, { rejectWithValue, fulfillWithValue, getState }) => {
      try {
        return fulfillWithValue(wallet);
      } catch (error) {
        // Handle any errors that may occur during wallet connection
        console.error("Error injecting wallet to honeycomb:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const loadIdentityDeps = createAsyncThunk<boolean>(
    "honeycomb/loadIdentityDeps",
    async (_, { getState, dispatch }) => {
      console.log("this");
      const {
        honeycomb: { wallet, user, profile, userApiCalled, profileApiCalled },
        auth: { authToken: token },
      } = getState() as { honeycomb: HoneycombState; auth: AuthState };
      console.log("loadIdentityDeps", wallet.publicKey);

      let authToken = token;
      if (!authToken && !wallet.publicKey) return false;
      if (!authToken) {
        const { token: newToken } = (await dispatch(authenticate()))
          .payload as {
          token: string;
        };

        authToken = newToken;
      }
      //todo: add fetching functions here
      await dispatch(fetchUser());
      await dispatch(fetchProfile());
      return true;
    }
  );

  const fetchUser = createAsyncThunk<User>(
    "honeycomb/fetchUser",
    async (_, { fulfillWithValue, rejectWithValue, dispatch, getState }) => {
      const {
        honeycomb: { wallet: stateWallet, edgeClient },
        auth: { wallet: walletKey },
      } = getState() as {
        honeycomb: HoneycombState;
        auth: AuthState;
      };
      const wallet = walletKey || stateWallet?.publicKey?.toString();

      try {
        console.log("fetchUser", wallet);
        const user = await edgeClient
          .findUsers({
            wallets: [wallet],
          })
          .then((data) => {
            if (!data || !data.user.length) {
              throw new Error("User not Found");
            }
            return data.user[0];
          })
          .catch((e) => {
            console.error("Error fetching user:", e);
            throw new Error("User not Found");
          });

        return fulfillWithValue(user) as User;
      } catch (error) {
        console.error("Error fetching user:", error);
        return rejectWithValue(error);
      }
    }
  );

  const fetchProfile = createAsyncThunk<Profile>(
    "honeycomb/fetchProfile",
    async (_, { fulfillWithValue, rejectWithValue, dispatch, getState }) => {
      const { wallet, edgeClient, user } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;
      if (!user) return rejectWithValue("User not found");
      try {
        const profile = await edgeClient
          .findProfiles({
            userIds: [user.id],
            projects: [HPL_PROJECT.toString()],
          })
          .then((data) => {
            if (!data || !data.profile.length) {
              throw new Error("Profile not Found");
            }
            return data.profile[0];
          })
          .catch((e) => {
            console.error("Error fetching Profile:", e);
            throw new Error("Profile not Found");
          });

        return fulfillWithValue(profile) as Profile;
      } catch (error) {
        console.error("Error fetching Profile:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const createUserAndProfile = createAsyncThunk<
    SendBulkTransactionsQuery,
    { username: string; bio: string; pfp: string | File }
  >(
    "honeycomb/createUserAndProfile",
    async (args, { rejectWithValue, fulfillWithValue, getState, dispatch }) => {
      // console.log("createUserAndProfile", args);

      const { wallet, edgeClient } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;

      try {
        if (!wallet.publicKey) {
          return rejectWithValue("No identity found");
        }

        let pfp: string = args.pfp as any;

        // let pfp: string | HoneycombFile = args.pfp as any;
        let uploading = false;
        // if (pfp && pfp instanceof File) {
        //   pfp = toHoneycombFile(await pfp.arrayBuffer(), "pfp.png");
        //   uploading = true;
        // }

        const toastId = toast.loading(
          uploading
            ? "Uploading Pfp & Creating User Profile..."
            : "Creating User Profile...",
          { progress: 0 }
        );

        const data = await edgeClient.createNewUserWithProfileTransaction({
          payer: PAYER_DRIVER,
          project: HPL_PROJECT.toString(),
          wallet: wallet.publicKey.toString(),
          userInfo: {
            bio: args.bio,
            username: args.username,
            pfp,
            name: args.username,
          },
          profileInfo: {
            bio: args.bio,
            pfp,
            name: args.username,
          },
        });

        const transaction = data.createNewUserWithProfileTransaction;

        const user = await edgeClient
          .sendBulkTransactions({
            txs: [transaction.transaction],
            blockhash: transaction.blockhash,
            lastValidBlockHeight: transaction.lastValidBlockHeight,
            options: {
              commitment: "processed",
              skipPreflight: true,
            },
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
        toast.update(toastId, {
          autoClose: 5000,
          type: "success",
          render: "Profile created..",
          progress: 1,
        });
        dispatch(HoneycombActionsWithoutThunk.clearProfileApiCalled());
        dispatch(HoneycombActionsWithoutThunk.clearUserApiCalled());
        await dispatch(fetchUser());
        await dispatch(fetchProfile());
        await dispatch(authenticate());

        return fulfillWithValue(user);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const updateProfile = createAsyncThunk<
    SendBulkTransactionsQuery,
    { username?: string; bio?: string; pfp?: string | File }
  >(
    "honeycomb/updateProfile",
    async (args, { rejectWithValue, fulfillWithValue, getState, dispatch }) => {
      let toastId;

      const { wallet, edgeClient, profile } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;

      try {
        if (!profile) throw rejectWithValue("No profile found");
        let profileInfo = {};

        let pfp: string = args.pfp as any;

        // let pfp: string | HoneycombFile = args.pfp as any;
        let uploading = false;
        // if (pfp && pfp instanceof File) {
        //   pfp = toHoneycombFile(await pfp.arrayBuffer(), "pfp.png");
        //   uploading = true;
        // }

        profileInfo = {
          bio: args.bio || profile.info.bio,
          name: args.username || profile.info.name,
          pfp: pfp || profile.info.pfp,
        };

        toastId = toast.loading(
          uploading
            ? "Uploading Pfp & Updating User Profile..."
            : "Updating User Profile...",
          { progress: 0 }
        );

        const data = await edgeClient.createUpdateProfileTransaction({
          profile: profile.address,
          info: profileInfo,
          payer: PAYER_DRIVER,
        });

        const transaction = data.createUpdateProfileTransaction;

        const profileRes = await edgeClient
          .sendBulkTransactions({
            txs: [transaction.transaction],
            blockhash: transaction.blockhash,
            lastValidBlockHeight: transaction.lastValidBlockHeight,
            options: {
              commitment: "processed",
              skipPreflight: true,
            },
          })
          .then(async (res) => {
            toast.update(toastId, {
              autoClose: 5000,
              type: "success",
              render: "Profile Creation Successful!!",
              progress: 1,
            });
            return res;
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
        await wait(500);
        await dispatch(fetchProfile());
        return fulfillWithValue(profileRes);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);
        toast.update(toastId, {
          autoClose: 5000,
          type: "error",
          render: "an unexpected error occured while creating User Profile",
          progress: 1,
        });
        return rejectWithValue(error);
      }
    }
  );

  const claimFaucet = createAsyncThunk<void, string>(
    "honeycomb/updateProfile",
    async (resourceId, { rejectWithValue, fulfillWithValue, getState }) => {
      const {
        auth: { wallet },
        honeycomb: { user },
      } = getState() as { honeycomb: HoneycombState; auth: AuthState };

      try {
        const { data } = await axios.post(`${API_URL}faucet/mine`, {
          user: {
            wallet,
            id: user.id,
          },
          resource: resourceId,
        });

        return fulfillWithValue(data);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);

        return rejectWithValue(error);
      }
    }
  );

  const createUser = createAsyncThunk<
    User,
    { username: string; bio: string; pfp: string | File }
  >(
    "honeycomb/createUser",
    async (args, { rejectWithValue, fulfillWithValue, getState }) => {
      console.log("createUser", args);

      const { wallet, edgeClient } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;

      try {
        if (!wallet.publicKey) {
          return rejectWithValue("No identity found");
        }

        let pfp: string = args.pfp as any;

        // let pfp: string | HoneycombFile = args.pfp as any;
        let uploading = false;
        // if (pfp && pfp instanceof File) {
        //   pfp = toHoneycombFile(await pfp.arrayBuffer(), "pfp.png");
        //   uploading = true;
        // }

        const toastId = toast.loading(
          uploading
            ? "Uploading Pfp & Creating User Profile..."
            : "Creating User Profile...",
          { progress: 0 }
        );

        const profilePromise = edgeClient.createNewUserTransaction({
          wallet: wallet.publicKey.toString(),
          info: {
            bio: args.bio,
            username: args.username,
            pfp,
            name: args.username,
          },
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
            console.error("an unexpected error occured while creating User", e);
            toast.update(toastId, {
              autoClose: 5000,
              type: "error",
              render: "an unexpected error occured while creating User",
              progress: 1,
            });
            throw rejectWithValue(e);
          });

        return fulfillWithValue(user as any as User);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const createProfile = createAsyncThunk<
    SendBulkTransactionsQuery,
    { name: string; bio: string; pfp: string | File }
  >(
    "honeycomb/createProfile",
    async (args, { rejectWithValue, fulfillWithValue, getState, dispatch }) => {
      const {
        honeycomb: { wallet, edgeClient, user },
        auth: { authToken: token },
      } = getState() as { honeycomb: HoneycombState; auth: AuthState };
      // const { authToken } = (getState() as { auth: AuthState }).auth;
      console.log("user", user);
      console.log("lfjaljaljdlaskjd", PAYER_DRIVER);
      try {
        if (!wallet.publicKey) {
          return rejectWithValue("No identity found");
        }
        let authToken = token;
        if (!authToken) {
          const { token: newToken } = (await dispatch(authenticate()))
            .payload as {
            token: string;
          };
          authToken = newToken;
        }
        console.log("authToken", authToken);
        let pfp: string = args.pfp as any;

        // let pfp: string | HoneycombFile = args.pfp as any;
        let uploading = false;
        // if (pfp && pfp instanceof File) {
        //   pfp = toHoneycombFile(await pfp.arrayBuffer(), "pfp.png");
        //   uploading = true;
        // }

        const toastId = toast.loading(
          uploading
            ? "Uploading Pfp & Creating User Profile..."
            : "Creating User Profile...",
          { progress: 0 }
        );

        const data = await edgeClient.createNewProfileTransaction(
          {
            project: HPL_PROJECT.toString(),
            identity: wallet.publicKey.toString(),
            info: {
              bio: args.bio,
              pfp,
              name: args.name,
            },
            payer: PAYER_DRIVER,
          },
          {
            fetchOptions: {
              headers: {
                authorization: `Bearer ${authToken}`,
              },
            },
          }
        );

        const transaction = data.createNewProfileTransaction;

        const profile = await edgeClient
          .sendBulkTransactions({
            txs: [transaction.transaction],
            blockhash: transaction.blockhash,
            lastValidBlockHeight: transaction.lastValidBlockHeight,
            options: {
              commitment: "processed",
              skipPreflight: true,
            },
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
        toast.update(toastId, {
          autoClose: 5000,
          type: "success",
          render: "Profile Created",
          progress: 1,
        });

        await wait(1000);
        await fetchProfile();
        return fulfillWithValue(profile);
      } catch (error) {
        console.error("Error Uploading file during Profile Creation:", error);
        throw rejectWithValue(error);
      }
    }
  );

  const authenticate = createAsyncThunk<{
    wallet: string;
    token: string;
    user: User;
    profile: Profile;
  }>(
    "honeycomb/authenticate",
    async (_, { rejectWithValue, fulfillWithValue, getState, dispatch }) => {
      // alert("honeycomb/authenticate")
      const { wallet, edgeClient, user, profile } = (
        getState() as { honeycomb: HoneycombState }
      ).honeycomb;

      try {
        if (!user) {
          throw new Error("User not found");
        }

        const res = await edgeClient.authRequest({
          wallet: wallet.publicKey.toString(),
        });

        const message = new TextEncoder().encode(res.authRequest.message);
        const sig = await wallet.signMessage(message);
        const signature = base58.encode(sig);

        const {
          authConfirm: { accessToken: token },
        } = await edgeClient.authConfirm({
          signature: signature,
          wallet: wallet.publicKey.toString(),
        });

        console.log("Authenticated", token, user, profile);

        return fulfillWithValue({
          token: token,
          user,
          profile,
          wallet: wallet.publicKey.toString(),
        });
      } catch (error) {
        console.error("Error authenticating", error);
        return rejectWithValue(error);
      }
    }
  );

  return {
    setWallet,
    createUser,
    createProfile,
    fetchUser,
    fetchProfile,
    loadIdentityDeps,
    createUserAndProfile,
    authenticate,
    updateProfile,
    claimFaucet,
  };
};
export default actionFactory;
