import { Profile, Sdk, User } from "@honeycomb-protocol/edge-client";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface HoneycombState {
  loaders: {
    [key: string]: boolean;
  };
  userApiCalled: boolean;
  profileApiCalled: boolean;
}

export interface AuthState {
  refreshInventory: boolean;
  cookingAddresses: {
    [key: string]: string;
  };
}

export type SignUpUserData = {
  username: string;
  name: string;
  bio: string;
  pfp: string | File;
};
