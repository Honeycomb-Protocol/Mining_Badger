import { toast } from "react-toastify";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useLogout, usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useHoneycombAuth } from "@honeycomb-protocol/profile-hooks";

import Utils from "@/lib/utils";
import { useHoneycomb } from "@/hooks";

const CustomWalletConnectButton = () => {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const { logout: honeyLogout } = useHoneycomb();
  const { wallets } = useSolanaWallets();
  const { logout } = useLogout();
  const { authenticated, user } = usePrivy();
  const { logout: HoneycombAuthLogout } = useHoneycombAuth();
  const { getMetakeepCache, setMetakeepCache, resetCache } = Utils();

  const metakeepCache = getMetakeepCache();

  return (
    <div className="flex flex-col items-center relative">
      <div
        style={{
          height: "40px",
          borderRadius: "10px",
          backgroundColor: "transparent",
          color: "#ffffff",
          width: "174px",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          alignItems: "center",
          cursor: "pointer",
        }}
        className="btn-gradient-color"
        onClick={() => setShowOptions(!showOptions)}
      >
        {authenticated && user?.wallet?.address
          ? user?.wallet?.address.toString().trim().slice(0, 6) +
            "..." +
            user?.wallet?.address.toString().trim().slice(-6)
          : metakeepCache?.publicKey.toString().trim().slice(0, 6) +
            "..." +
            metakeepCache?.publicKey.toString().trim().slice(-6)}
      </div>
      {showOptions && (
        <div className="bg-[#2c2d30] w-[174px] rounded-[10px] border-0 mt-2 text-black font-medium text-sm text-center absolute top-10 p-2">
          <p
            className="py-3 text-white cursor-pointer transition hover:bg-gray-900 font-bold rounded-[10px]"
            onClick={() => {
              navigator.clipboard.writeText(
                authenticated && user?.wallet?.address
                  ? user?.wallet?.address.toString().trim()
                  : metakeepCache?.publicKey.toString().trim()
              );
              setShowOptions(false);
            }}
          >
            Copy address
          </p>
          <p
            className="py-3 mt-2 text-white cursor-pointer transition hover:bg-gray-900 font-bold rounded-[10px]"
            onClick={async () => {
              if (authenticated && user?.wallet?.address) {
                await logout();
                wallets[0].disconnect();
              } else {
                setMetakeepCache({
                  email: null,
                  publicKey: null,
                });
              }
              await honeyLogout();
              await HoneycombAuthLogout();

              resetCache();
              toast.success("Logged out successfully");
              router.push("/");
            }}
          >
            Disconnect
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomWalletConnectButton;
