import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

const WalletButton = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();
  return (
    //filter those wallets which are installed in the browser
    <div>
      {wallets.filter((wallet) => wallet.readyState === "Installed").length >
      0 ? (
        wallets
          .filter((wallet) => wallet.readyState === "Installed")
          .map((wallet) => (
            <button
            key={wallet.adapter.name}
            onClick={() => select(wallet.adapter.name)}
           
           
           
            leftIcon={
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                
              />
            }
          >
        
    </div>
  );
};
