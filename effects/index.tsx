import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import {
  useHoneycombAuth,
  useHoneycombInfo,
} from "@honeycomb-protocol/profile-hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import Utils from "@/lib/utils";
import { useHoneycomb } from "../hooks";

export default function Effects() {
  const { resetCache } = Utils();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useHoneycomb();
  const { currentUser, currentProfile, currentWallet, edgeClient } =
    useHoneycombInfo();
  const { authToken } = useHoneycombAuth();
  const wallet = useWallet();

  console.log(
    "currentUser, currentProfile, currentWallet, authToken, edge client",
    currentUser,
    currentProfile,
    currentWallet,
    authToken,
    edgeClient
  );

  useEffect(() => {
    (async () => {
      if (wallet?.disconnecting) {
        console.log("EFFECT 1: Logging out");
        await logout();
        resetCache();
        toast.success("Logged out successfully");
        router.push("/");
      }
    })();
  }, [wallet?.disconnecting]);

  useEffect(() => {
    if (currentUser && currentProfile && wallet?.connected) {
      if (pathname === "/create-profile" || pathname === "/") {
        console.log("EFFECT 3: Redirecting to home");
        router.push("/home");
      }
    } else if (!authToken && pathname !== "/") {
      router.push("/");
    }
  }, [currentUser, currentProfile, wallet?.connected]);

  return <></>;
}
