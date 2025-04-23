import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import {
  useHoneycombAuth,
  useHoneycombInfo,
  useHoneycombSocials,
} from "@honeycomb-protocol/profile-hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import Utils from "@/lib/utils";
import { useHoneycomb } from "../hooks";
import { useMetakeep } from "@/context/metakeep-context";
import { useGateway } from "@civic/solana-gateway-react";

export default function Effects() {
  const { resetCache } = Utils();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useHoneycomb();
  const { user, authenticated, ready } = usePrivy();
  const { gatewayToken, gatewayStatus } = useGateway();
  const { currentUser, currentProfile, currentWallet } = useHoneycombInfo();
  const { authToken, logout: HoneycombLogout } = useHoneycombAuth();
  const { populateCivicForUserWallets } = useHoneycombSocials();
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
    } else {
      router.push("/");
    }
  }, [
    currentUser,
    currentProfile,
    wallet?.connected,
    metakeepCache?.connected,
    authenticated && ready && user?.wallet?.address,
  ]);

  useEffect(() => {
    (async () => {
      const gatewayPub = process.env.NEXT_PUBLIC_GATEKEEPER_NETWORK!;
      const userCivicPass = currentUser?.socialInfo.civic?.map((item) => {
        if (
          item?.gatekeeperNetwork.toString() === gatewayPub &&
          currentUser?.wallets?.wallets[item?.walletIndex]
        ) {
          return item;
        }
      });
      if (
        gatewayToken?.gatekeeperNetworkAddress.toString() === gatewayPub &&
        gatewayStatus === 9 &&
        userCivicPass?.length === 0
      ) {
        //TODO: remove below comment on mainnet.
        // await populateCivicForUserWallets({ populateCivic: true });
      }
    })();
  }, [gatewayToken, gatewayStatus]);

  return <></>;
}
