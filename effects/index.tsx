import { useEffect } from "react";
import { useHoneycomb } from "../hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";

import Utils from "@/lib/utils";

export default function Effects() {
  const { resetCache } = Utils();
  const wallet = useWallet();
  const pathname = usePathname();
  const router = useRouter();
  const {
    setWallet,
    loadIdentityDeps,
    wallet: stateWallet,
    user,
    profile,
    authToken,
    userApiCalled,
    profileApiCalled,
    logout,
  } = useHoneycomb();

  useEffect(() => {
    (async () => {
      if (wallet.disconnecting) {
        await logout();
        resetCache();
        router.push("/");
      }
    })();
  }, [wallet]);

  useEffect(() => {
    if (
      wallet?.publicKey &&
      stateWallet?.publicKey &&
      stateWallet?.publicKey?.equals(wallet?.publicKey)
    ) {
      return;
    }
    console.log("EFFECT 1: Setting Wallet");
    setWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    if (stateWallet?.publicKey || authToken) {
      console.log("EFFECT 2: loadIdentityDeps");
      loadIdentityDeps();
    }
  }, [stateWallet, authToken]);

  useEffect(() => {
    if (user && profile && wallet?.connected) {
      if (pathname === "/create-profile" || pathname === "/") {
        console.log("EFFECT 3: Redirecting to home");
        router.push("/home");
      }
    } else if (!authToken && pathname !== "/") {
      router.push("/");
    }
  }, [user, profile]);

  return <></>;
}
