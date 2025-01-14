import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { HoneycombProvider } from "@honeycomb-protocol/profile-hooks";
import { store } from "@/store";
import { useMetakeepCache } from "@/lib/utils";

const HoneycombProfilesWrapper = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(null);
  const wallet = useWallet();
  const { user } = usePrivy();
  const metakeepCache = useMetakeepCache();
  const { wallets } = useSolanaWallets();

  console.log("metakeepCache 3122222222", currentWallet);
  useEffect(() => {
    (async () => {
      console.log("====================================");
      console.log("metakeepCache", metakeepCache);
      console.log("====================================");

      if (wallet?.publicKey) {
        console.log("coming to 1");
        setCurrentWallet(wallet);
      } else if (metakeepCache?.publicKey) {
        console.log("coming to 2");
        setCurrentWallet(metakeepCache);
      } else if (wallets?.length > 0 && wallets[0]?.address) {
        console.log("coming to 3");
        const isConnected = await wallets[0]?.isConnected().then((res) => res);
        const walletAdapt = {
          ...wallets[0],
          publicKey: new PublicKey(wallets[0]?.address),
          connected: isConnected || false,
        };
        setCurrentWallet(walletAdapt);
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
