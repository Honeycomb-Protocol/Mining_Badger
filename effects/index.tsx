import { useEffect } from "react";
import { useHoneycomb } from "../hooks";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Effects() {
  const wallet = useWallet();
  const { setWallet, loadIdentityDeps, wallet: stateWallet } = useHoneycomb();

  console.log("EFFECTS");

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
    if (stateWallet?.publicKey) {
      console.log("EFFECT 2: loadIdentityDeps");
      loadIdentityDeps();
    }
  }, [stateWallet]);

  return <></>;
}
