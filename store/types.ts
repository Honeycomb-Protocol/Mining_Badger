import { Profile, Sdk, User } from "@honeycomb-protocol/edge-client";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface HoneycombState {
  wallet: WalletContextState | null;
  edgeClient: Sdk;
  user: User | null;
  profile: Profile | null;
  loaders: {
    [key: string]: boolean;
  };
}

export interface AuthState {
  authStatus: "pending" | "success" | "failed" | "loggedOut" | null;
  authLoader: boolean;
  refreshInventory: boolean;
  authToken: string | null | undefined;
}

export type SignUpUserData = {
  username: string;
  name: string;
  bio: string;
  pfp: string | File;
};
