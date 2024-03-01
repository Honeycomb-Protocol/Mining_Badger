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
}

export interface CardProps {
  buttonText?: string;
  level?: string;
  picture: string;
  name: string;
  notification?: number;
  imageHeight?: number;
  imageWidth?: number;
  width?: number;
  nftNameStyle?: string;
  btnStyle?: string;
  btnDisabled?: boolean;
  lock?: boolean;
  lockStyle?: string;
  creationFrom?: string;
  materials?: materials[];
  experience?: number;
  divStyle?: string;
  expIn?: number;
  btnClick?: () => void;
}

export interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
