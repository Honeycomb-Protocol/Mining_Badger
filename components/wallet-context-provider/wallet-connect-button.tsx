import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import { useHoneycomb } from "@/hooks";

import Button from "@/components/common/button";

const WalletConnectButton = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { user, profile } = useHoneycomb();
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 mt-4">
        {publicKey && (
          <WalletMultiButton
            style={{
              height: "40px",
              borderRadius: "15px",
              backgroundColor: "transparent",
              color: "#ffffff",
              width: "174px",
              display: "flex",
              justifyContent: "center",
              border: "2px solid #8E8B77",
              fontSize: "12px",
            }}
          />
        )}
      </div>

      {publicKey ? (
        <Button
          styles="w-96 text-lg"
          btnText="Let's Create an Account"
          loading={false}
          onClick={() => {
            router.push("/create-profile");
          }}
        />
      ) : (
        <WalletMultiButton
          style={{
            padding: "8px 16px",
            borderRadius: "12px",
            backgroundImage:
              "linear-gradient(to right, #E7CB5F -80%, #CD6448 150%)",
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
  );
};

export default WalletConnectButton;
