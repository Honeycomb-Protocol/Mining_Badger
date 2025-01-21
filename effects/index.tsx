import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import {
  useHoneycombAuth,
  useHoneycombInfo,
} from "@honeycomb-protocol/profile-hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import Utils from "@/lib/utils";
import { useHoneycomb } from "../hooks";
import { useMetakeep } from "@/context/metakeep-context";

export default function Effects() {
  const { resetCache } = Utils();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useHoneycomb();
  const { user, authenticated, ready } = usePrivy();
  const { currentUser, currentProfile, currentWallet } = useHoneycombInfo();
  const { authToken, logout: HoneycombLogout } = useHoneycombAuth();
  const { metakeepCache } = useMetakeep();
  const wallet = useWallet();

  useEffect(() => {
    (async () => {
      if (wallet?.disconnecting) {
        await logout();
        await HoneycombLogout();
        resetCache();
        toast.success("Logged out successfully");
        router.push("/");
      }
    })();
  }, [wallet?.disconnecting]);

  useEffect(() => {
    if (
      currentUser &&
      currentProfile &&
      (wallet?.connected ||
        (metakeepCache?.connected && metakeepCache?.publicKey) ||
        (authenticated &&
          ready &&
          user?.wallet?.address &&
          currentWallet?.connected))
    ) {
      if (
        pathname === "/create-profile" ||
        pathname === "/" ||
        pathname === "/login-with-email"
      ) {
        router.push("/home");
      }
    } else if (!authToken && pathname !== "/") {
      router.push("/");
    }
  }, [
    currentUser,
    currentProfile,
    wallet?.connected,
    metakeepCache?.connected,
    authenticated && ready && user?.wallet?.address,
  ]);

  return <></>;
}
