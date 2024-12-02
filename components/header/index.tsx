import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-row ${
        router.pathname !== "/" ? "justify-between" : "justify-center"
      } items-center w-full`}
    >
      {router.pathname !== "/" && (
        <div className="flex justify-center items-center">
          <div>
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
            {/* <Footer /> */}
          </div>
        </div>
      )}
      <Image src="/assets/images/logo.png" alt="logo" width={370} height={0} />
      {router.pathname !== "/" && (
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
