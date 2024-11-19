import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";

import Utils from "@/lib/utils";
import { useHoneycomb } from "../hooks";

export default function Effects() {
  const { resetCache } = Utils();
  const wallet = useWallet();
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    profile,
    authToken,
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
