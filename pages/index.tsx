import Footer from "@/components/footer";
import WalletContextProvider from "@/components/wallet-context-provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";

export default function Home() {
  //console connection every time it gets connected

  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect } = useWallet();
  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    console.log("Connection to cluster established:", connection);
    console.log("Public key:", publicKey.toBase58());

    // Ensure the balance updates after the transaction completes
  }, [connection, publicKey]);

  return (
    <main className={``}>
      <h1 className="font-bold text-[80px]">WELCOME TO THE GAME</h1>

      <WalletMultiButton />
      <WalletModalButton />
      <WalletDisconnectButton />

      <Footer />
    </main>
  );
}
