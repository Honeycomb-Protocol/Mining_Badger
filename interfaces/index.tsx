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

export interface TabDataProps {
  name: string;
  notifications?: number;
  tabComponent: React.ReactNode;
}

export interface CustomTabsProps {
  tabData: TabDataProps[];
  styles?: string;
  initialActiveTab: string;
  isVertical?: boolean;
  data?: any;
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
}

export interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export interface MineDataType {
  addresses: {
    mint: string;
    recipe: string | null;
    resource: string;
    tree: string;
  };
  amount: number | null;
  expire?: number;
  level_req: number;
  metadata: {
    name: string;
    symbol: string;
    uri: string;
  };
}
