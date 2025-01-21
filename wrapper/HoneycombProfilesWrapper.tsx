import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { HoneycombProvider } from "@honeycomb-protocol/profile-hooks";

import { store } from "@/store";
import { useMetakeep } from "@/context/metakeep-context";

const HoneycombProfilesWrapper = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(null);
  const wallet = useWallet();
  const { user } = usePrivy();
  const { wallets } = useSolanaWallets();
  const { metakeepCache } = useMetakeep();

  useEffect(() => {
    const handleDisconnect = () => {
      setCurrentWallet(null);
    };
    //@ts-ignore
    wallet?.adapter?.on("disconnect", handleDisconnect);
    return () => {
      //@ts-ignore
      wallet?.adapter?.off("disconnect", handleDisconnect);
    };
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        setCurrentWallet(wallet);
      } else if (metakeepCache?.publicKey) {
        setCurrentWallet(metakeepCache);
      } else if (wallets?.length > 0 && wallets[0]?.address) {
        const isConnected = await wallets[0]?.isConnected().then((res) => res);
        const walletAdapt = {
          ...wallets[0],
          publicKey: new PublicKey(wallets[0]?.address),
          connected: isConnected || false,
        };
        setCurrentWallet(walletAdapt);
      } else {
        setCurrentWallet(null);
      }
    })();
  }, [wallet?.publicKey, metakeepCache?.publicKey, wallets[0]?.address]);

  useEffect(() => {
    if (!user && wallets?.length > 0 && wallets[0]?.address) {
      const walletAdapt = {
        ...wallets[0],
        connected: false,
      };
      setCurrentWallet(walletAdapt);
    }
  }, [user]);

  return (
    <HoneycombProvider
      hplProjectAddress={process.env.NEXT_PUBLIC_HPL_PROJECT}
      wallet={currentWallet}
      rpcEdpoint={process.env.NEXT_PUBLIC_RPC_ENDPOINT!}
      edgeClientUrl={process.env.NEXT_PUBLIC_EDGE_CLIENT!}
      store={store}
    >
      {children}
    </HoneycombProvider>
  );
};

export default HoneycombProfilesWrapper;
