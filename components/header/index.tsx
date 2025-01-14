import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Utils from "@/lib/utils";
import CustomWalletConnectButton from "../custom-wallet-button";

const Header = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { authenticated, ready, user } = usePrivy();
  const { getMetakeepCache } = Utils();
  const metakeepCache = getMetakeepCache();
  return (
    <div
      className={`flex flex-row ${
        router.pathname !== "/" && router.pathname !== "/login-with-email"
          ? "justify-between"
          : "justify-center"
      } items-center w-full`}
    >
      {router.pathname !== "/" && router.pathname !== "/login-with-email" && (
        <div className="flex justify-center items-center">
          {wallet?.publicKey ? (
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
          ) : metakeepCache?.publicKey ||
            (authenticated && ready && user?.wallet?.address) ? (
            <CustomWalletConnectButton />
          ) : null}
        </div>
      )}
      <Image src="/assets/images/logo.png" alt="logo" width={370} height={0} />
      {router.pathname !== "/" && router.pathname !== "/login-with-email" && (
        <div className="flex flex-row gap-5">
          <Image
            onClick={() => {
              window.open("https://www.honeycombprotocol.com/");
            }}
            className="cursor-pointer"
            width={35}
            height={35}
            src="/assets/svgs/home-icon.svg"
            alt="github"
          />

          <Image
            width={30}
            height={30}
            src="/assets/svgs/twitter-x-icon.svg"
            alt="twitter"
            className="cursor-pointer"
            onClick={() => {
              window.open("https://twitter.com/honeycomb_prtcl");
            }}
          />
          <Image
            width={30}
            height={30}
            src="/assets/svgs/discord-icon.svg"
            alt="discord"
            className="cursor-pointer"
            onClick={() => {
              window.open("https://discord.com/invite/honeycombprotocol");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
