import React, { useEffect, useState } from "react";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { useHoneycomb } from "@/hooks";
import { RootState } from "@/store";

const Header = () => {
  const router = useRouter();
  const { user } = useHoneycomb();
  const { refreshInventory, authLoader } = useSelector(
    (state: RootState) => state.auth
  );
  const [userSolBalance, setUserSolBalance] = useState(0);

  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
    "processed"
  );

  //To get the user's sol balance
  useEffect(() => {
    if (
      (user?.wallets?.shadow && refreshInventory === true) ||
      (user?.wallets?.shadow && authLoader === true)
    ) {
      GetSolBalance();
    }
  }, [refreshInventory, authLoader]);

  const GetSolBalance = async () => {
    try {
      const balance = await connection.getBalance(
        new PublicKey(user?.wallets?.shadow)
      );
      setUserSolBalance(balance / LAMPORTS_PER_SOL);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.log("Error", error);
    }
  };

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
          {/* {user?.wallets?.shadow && (
            <div className="rounded-lg border-2 border-gray-800 p-2 ml-6">
              <div className="flex justify-center items-center">
                <p>Shadow Signer</p>
                <p className="text-sm text-gray-400 ml-5">{`${user?.wallets?.shadow.slice(
                  0,
                  4
                )}....${user?.wallets?.shadow.slice(40)}`}</p>
                <Image
                  src="/assets/svgs/copy-icon.svg"
                  width={17}
                  height={17}
                  alt="copy"
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.wallets?.shadow);
                    toast.success("Copied to clipboard");
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="font-bold flex justify-center items-center">
                  <Image
                    src="/assets/svgs/solana-icon.svg"
                    alt="solana"
                    width={15}
                    height={15}
                  />
                  <p className="text-sm font-bold ml-2">{userSolBalance}</p>
                </div>
                <Image
                  src="/assets/svgs/sol-icon.svg"
                  alt="sol"
                  width={15}
                  height={15}
                />
              </div>
            </div>
          )} */}
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
