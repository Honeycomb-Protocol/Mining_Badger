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

// export interface MineDataType {
//   addresses: {
//     mint: string;
//     recipe: string | null;
//     resource: string;
//     tree: string;
//   };
//   amount: number | null;
//   expire?: number;
//   level_req: number;
//   metadata: {
//     name: string;
//     symbol: string;
//     uri: string;
//   };
// }
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
  craft_time: number;
  xp: number;
  ingredients: Ingredient[];
}

export type Dataset = {
  success: boolean;
  code: number;
  message: string;
  result: Resource[];
};

export enum ResourceType {
  ALL = "All",
  ORE = "ORE",
  Pickaxe = "Pickaxe",
  BAR = "BAR",
}
