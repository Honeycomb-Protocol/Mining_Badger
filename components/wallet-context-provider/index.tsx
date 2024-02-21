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

import { WalletContextProviderProps } from "@/interfaces";
require("@solana/wallet-adapter-react-ui/styles.css");

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
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
