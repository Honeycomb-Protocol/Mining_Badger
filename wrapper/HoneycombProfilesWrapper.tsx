import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { HoneycombProvider } from "@honeycomb-protocol/profile-hooks";
import { store } from "@/store";

const HoneycombProfilesWrapper = ({ children }) => {
  const wallet = useWallet();

  return (
    <HoneycombProvider
      hplProjectAddress={process.env.NEXT_PUBLIC_HPL_PROJECT}
      wallet={wallet}
      rpcEdpoint={process.env.NEXT_PUBLIC_RPC_ENDPOINT!}
      edgeClientUrl={process.env.NEXT_PUBLIC_EDGE_CLIENT!}
      store={store}
    >
      {children}
    </HoneycombProvider>
  );
};

export default HoneycombProfilesWrapper;
