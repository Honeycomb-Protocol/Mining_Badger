import React from "react";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

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
          <div>
            
          </div>
        </div>
      )}
      <Image src="/assets/images/logo.png" alt="logo" width={370} height={0} />
      {router.pathname !== "/" && (
        <div className="flex flex-row gap-5">
          <Image
            onClick={() => {
              router.push("/home");
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
          />
          <Image
            width={30}
            height={30}
            src="/assets/svgs/discord-icon.svg"
            alt="discord"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
