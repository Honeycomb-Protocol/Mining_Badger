import dynamic from "next/dynamic";
import { FC, useMemo } from "react";
import * as web3 from "@solana/web3.js";

const WalletProvider = dynamic(
  () =>
    import("@solana/wallet-adapter-react").then((module) => ({
      default: module.WalletProvider,
    })),
  {
    ssr: false,
  }
);

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import dotenv from "dotenv";
dotenv.config();

import { WalletContextProviderProps } from "@/interfaces";
require("@solana/wallet-adapter-react-ui/styles.css");

/**
 * Get the client for the edge server
 * @param {string} process.env.NEXT_PUBLIC_EDGE_CLIENT - The url of the rpc server
 * @returns {Client} - The client for the edge server
 */

const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  const wallets = useMemo(() => [], []);

  const endpoint = web3.clusterApiUrl("devnet");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
