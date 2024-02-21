import React from "react";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Footer from "../footer";

const Header = () => {
  return (
    <div
      className={`flex flex-row ${
        window.location.pathname !== "/" ? "justify-between" : "justify-center"
      } items-center  w-full`}
    >
      {window.location.pathname !== "/" && (
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
      <Image src="/assets/images/logo.png" alt="logo" width={350} height={0} />
      {window.location.pathname !== "/" && (
        <div className="flex flex-row gap-3">
          <Image
            width={30}
            height={30}
            src="/assets/svgs/github-icon.svg"
            alt="github"
          />
          <Image
            width={30}
            height={30}
            src="/assets/svgs/discord-icon.svg"
            alt="discord"
          />
          <Image
            width={30}
            height={30}
            src="/assets/svgs/twitter-icon.svg"
            alt="twitter"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
