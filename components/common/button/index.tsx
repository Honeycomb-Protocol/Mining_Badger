import React from "react";
import { Spinner } from "@nextui-org/react";

import { ButtonProps } from "@/interfaces";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Button = ({ styles, onClick, loading, btnText }: ButtonProps) => {
  return (
    <button className={`${styles}`} onClick={onClick}>
      {loading ? <Spinner color="default" size="sm" /> : btnText}
    </button>
  );
};

export default Button;
