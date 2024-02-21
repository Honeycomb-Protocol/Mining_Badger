import Button from "@/components/common/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

const WalletConnectButton = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();
  return (
    //filter those wallets which are installed in the browser
    <div>
      {!publicKey && (
        <WalletMultiButton
          children={<p>Connect Wallet</p>}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#da821a",
            color: "#ffffff",
            width: "384px",
            marginTop: "48px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}

      {publicKey && (
        <div className="flex flex-col items-center">
          <WalletMultiButton
            style={{
              padding: "8px 16px",
              borderRadius: "15px",
              backgroundColor: "transparent",
              color: "#ffffff",
              width: "184px",
              marginTop: "48px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              border: "2px solid #8E8B77",
            }}
          />

          <Button
            styles="w-96 mt-12"
            btnText="Let's Create an Account"
            loading={false}
            onClick={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
