import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { ReactNode } from "react";

export interface AuthenticationState {
  user: string | null;
  isLoading: boolean;
}

export interface ButtonProps {
  styles?: string;
  onClick: () => void;
  loading: boolean;
  btnText: string;
  disable?: boolean;
}

export interface WalletContextProviderProps {
  children: ReactNode;
}

export interface CustomTextAreaProps {
  styles: string;
  value: string;
  placeholder: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface CustomInputProps {
  styles: string;
  value: string;
  placeholder: string;
  type: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CustomTabsProps {
  tabData: string[];
  styles?: string;
  initialActiveTab: string;
  isVertical?: boolean;
}

export interface materials {
  name: string;
  amount: number;
  uri: string;
  id: string;
  symbol: string;
}

export interface CardProps {
  buttonText?: string;
  level?: number;
  picture: string;
  name: string;
  amount?: number;
  imageHeight?: number;
  imageWidth?: number;
  width?: number;
  nftNameStyle?: string;
  btnStyle?: string;
  btnDisabled?: boolean;
  lock?: boolean;
  btnInfo?: string;
  lockStyle?: string;
  materials?: materials[];
  experience?: number;
  divStyle?: string;
  expIn?: number;
  btnClick?: () => void;
  loading?: { name: string; status: boolean };
  miningTimeReduction?: string;
  resourceInfo?: string;
  addStyles?: string;
}

export interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export interface MineDataType {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  mine_time: number;
  xp: number;
  address: string;
  tree: string;
  recipe: null;
  expire?: number;
}

export interface Ingredient {
  name: string;
  symbol: string;
  uri: string;
  amount: number;
}

export interface Resource {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  craft_time: number;
  xp: number;
  ingredients: Ingredient[];
  address: string;
  mint: string;
  recipe: string;
  time_reduced: number;
  amount: number;
  tags: string[];
}

export interface Craft {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  xp: number;
  tags: string[];
  craft_time: number;
  ingredients: Record<string, number>;
  address: string;
  mint: string;
  recipe: string;
}

export type Dataset = {
  success: boolean;
  code: number;
  message: string;
  result: Resource[];
};

export enum ResourceType {
  ALL = "All",
  ORE = "ORES",
  Pickaxe = "Pickaxe",
  BAR = "BARS",
}

export interface HVUser {
  id: string;
  wallet: string;
}

export interface Ores {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  mine_time: number;
  xp: number;
  tags: string[];
  address: string;
  mint: string;
}

export interface PickAxes {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  time_reduced: number;
  address: string;
  tags: string[];
  mint: string;
}

export interface Bars {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  xp: number;
  refine_time: number;
  tags: string[];
  ingredients: Record<string, number>;
  address: string;
  mint: string;
  recipe: string;
}

export interface MineData {
  user: string;
  wallet: string;
  resource: string;
  created_at: number;
  will_expire: number;
}

export interface Traits {
  name: string;
  symbol: string;
  uri: string;
  lvl_req: number;
  xp: number;
  tags: string[];
  craft_time: number;
  ingredients: Record<string, number>;
  address: string;
  mint: string;
  recipe: string;
}

export type File = {
  project: string;
  characterModel: string;
  lutAddresses: string[];
  assemblerConfig: string;
  characterTree: string;
  traits: Record<string, Traits>;
  resources: Record<string, Resource>;
};

export type ProxyAdapter = {
  publicKey: PublicKey | null;
  connected: boolean;
  signTransaction?<T extends Transaction | VersionedTransaction>(
    transaction: T,
    reason?: string
  ): Promise<T>;
  signAllTransactions?<T extends Transaction | VersionedTransaction>(
    transaction: T[],
    reason?: string
  ): Promise<T[]>;
  signAllTransactions?<T extends Transaction | VersionedTransaction>(
    transaction: T[],
    reason?: string
  ): Promise<T[]>;
  signMessage?(message: Uint8Array, reason?: string): Promise<Uint8Array>;
  sendTransaction?(transaction: Transaction): Promise<string>;
};

export interface InventoryState {
  refreshInventory: boolean;
  cookingAddresses: {
    [key: string]: string;
  };
}
