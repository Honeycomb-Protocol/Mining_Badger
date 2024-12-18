import type { AppProps } from "next/app";
// import { K2D } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import {
  GatewayProvider,
  GatewayStatus,
  useGateway,
} from "@civic/solana-gateway-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import "@/styles/globals.css";
import Effects from "@/effects";
import CheckConnection from "@/wrapper";
import Header from "@/components/header";
import { GATE_NETWORK } from "@/config/config";
import Button from "@/components/common/button";
import WalletContextProvider from "@/components/wallet-context-provider";
import HoneycombProfilesWrapper from "@/wrapper/HoneycombProfilesWrapper";

// const k2d = K2D({ weight: "400", subsets: ["latin"] });

const GateWayCivic = ({ children }) => {
  const { currentWallet } = useHoneycombInfo();

  return (
    <GatewayProvider
      connection={
        new Connection("https://rpc.magicblock.app/devnet/", "processed")
      }
      cluster="devnet"
      wallet={currentWallet}
      gatekeeperNetwork={new PublicKey(GATE_NETWORK)}
    >
      {children}
    </GatewayProvider>
  );
};

export const Footer = () => {
  const { requestGatewayToken, gatewayStatus } = useGateway();

  return (
    <div className="text-xs flex justify-between items-center">
      <div>
        <p>Proof your identity through civic.</p>
        <p className="text-yellow-500">
          Make sure to have ( SOL ) on devnet.
        </p>{" "}
      </div>
      <Button
        btnText={GatewayStatus[gatewayStatus]}
        onClick={requestGatewayToken}
        loading={false}
        styles="text-[10px]"
      />
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <HoneycombProfilesWrapper>
          <GateWayCivic>
            <Effects />
            {/* <main className={k2d.className}> */}
            <main>
              <NextUIProvider>
                <Header />
                <CheckConnection>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  <Component {...pageProps} />
                </CheckConnection>
              </NextUIProvider>
            </main>
          </GateWayCivic>
      </HoneycombProfilesWrapper>
    </WalletContextProvider>
  );
}
