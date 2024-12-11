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
  const { currentUser, currentProfile } = useHoneycombInfo();
  const { authToken, logout: HoneycombLogout } = useHoneycombAuth();
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
    if (currentUser && currentProfile && wallet?.connected) {
      if (pathname === "/create-profile" || pathname === "/") {
        router.push("/home");
      }
    } else if (!authToken && pathname !== "/") {
      router.push("/");
    }
  }, [currentUser, currentProfile, wallet?.connected]);

  return <></>;
}
