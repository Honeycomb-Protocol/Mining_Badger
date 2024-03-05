import type {
  Honeycomb,
} from '@honeycomb-protocol/hive-control';
import { Sdk, User } from "@honeycomb-protocol/edge-client";

export interface HoneycombState {
  honeycomb: Honeycomb;
  projects: Honeycomb['_projects'];
  edgeClient: Sdk;
  user: User | null;
  loaders: {
    [key: string]: boolean;
  };
  openWallet: boolean;
  isWalletUserFound: boolean;
  loadingModal: boolean;
}

export interface AuthState {
  authStatus: 'pending' | 'success' | 'failed' | 'loggedOut' | null;
  authLoader: boolean;
  userExists: boolean;
  profileExists: boolean;
  authToken: string | null | undefined;
  isAdmin: boolean;
}

export type SignUpUserData = {
  username: string;
  name: string;
  bio: string;
  pfp: string | File;
};
