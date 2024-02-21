import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Button from "@/components/common/button";

const WalletConnectButton = () => {
  const { publicKey } = useWallet();
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="mb-6 mt-4">
          {publicKey ? (
            <WalletMultiButton
              style={{
                padding: "8px 16px",
                borderRadius: "15px",
                backgroundColor: "transparent",
                color: "#ffffff",
                width: "184px",
                display: "flex",
                justifyContent: "center",
                border: "2px solid #8E8B77",
              }}
            />
          ) : (
            <p className="text-lg">TO BEGIN THE MINING ADVENTURE </p>
          )}
        </div>

        {publicKey ? (
          <Button
            styles="w-96"
            btnText="Let's Create an Account"
            loading={false}
            onClick={() => {}}
          />
        ) : (
          <WalletMultiButton
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "#da821a",
              color: "#ffffff",
              width: "384px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p>Connect Wallet</p>
          </WalletMultiButton>
        )}
      </div>
    </div>
  );
};

export default WalletConnectButton;
