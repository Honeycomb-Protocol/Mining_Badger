"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "dark",
          loginMessage: "Welcome to the Mining Badger!",
          walletChainType: "solana-only",
        },
        embeddedWallets: {
          createOnLogin: "off",
          showWalletUIs: true,
          waitForTransactionConfirmation: true,
        },
        solanaClusters: [
          {
            // name: "mainnet-beta",
            name: "devnet",
            rpcUrl:
              "https://devnet.helius-rpc.com/?api-key=f0c675c2-dc2a-4ea2-b09f-c080e4205347",
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
