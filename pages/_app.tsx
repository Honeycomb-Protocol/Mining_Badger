import type { AppProps } from "next/app";
import { K2D } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

import "@/styles/globals.css";
import Header from "@/components/header";
import WalletContextProvider from "@/components/wallet-context-provider";
import CheckConnection from "@/wrapper";
import { store } from "@/store";
import Effects from "@/effects";
import {
  GatewayProvider,
  GatewayStatus,
  useGateway,
} from "@civic/solana-gateway-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { GATE_NETWORK, RPC_URL } from "@/config/config";
import { useWallet } from "@solana/wallet-adapter-react";
import Button from "@/components/common/button";
const k2d = K2D({ weight: "400", subsets: ["latin"] });

const GateWayCivic = ({ children }) => {
  const wallet = useWallet();
  return (
    <GatewayProvider
      connection={new Connection(RPC_URL, "processed")}
      cluster="mainnet-beta"
      wallet={wallet}
      gatekeeperNetwork={new PublicKey(GATE_NETWORK)}
    >
      {children}
    </GatewayProvider>
  );
};

export const Footer = () => {
  const { requestGatewayToken, gatewayStatus } = useGateway();

  return (
    <div className="text-xs">
      Proof your identity through civic{" "}
      <Button
        btnText={GatewayStatus[gatewayStatus]}
        onClick={requestGatewayToken}
        loading={false}
         styles="text-[10px] ml-10"
      />
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GateWayCivic>
          <Effects />
          <main className={k2d.className}>
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
      </Provider>
    </WalletContextProvider>
  );
}
