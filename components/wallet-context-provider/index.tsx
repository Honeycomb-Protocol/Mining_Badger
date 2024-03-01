import * as web3 from "@solana/web3.js";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { FC, useMemo } from "react";
import dynamic from "next/dynamic";

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
import { Sdk } from "@honeycomb-protocol/edge-client";
import createEdgeClient from "@honeycomb-protocol/edge-client/client";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import dotenv from "dotenv";
dotenv.config();

import { WalletContextProviderProps } from "@/interfaces";
require("@solana/wallet-adapter-react-ui/styles.css");

/**
 * Get the client for the edge server
 * @param {string} process.env.NEXT_PUBLIC_EDGE_CLIENT - The url of the rpc server
 * @returns {Client} - The client for the edge server
 */
export const getEdgeClient = (url = process.env.NEXT_PUBLIC_EDGE_CLIENT!): Sdk =>
  createEdgeClient(
    new Client({
      url: url,
      exchanges: [cacheExchange, fetchExchange],
    })
  );

const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  const wallets = useMemo(
    () => [
      new walletAdapterWallets.PhantomWalletAdapter(),
      new walletAdapterWallets.SolflareWalletAdapter(),
    ],
    []
  );

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
