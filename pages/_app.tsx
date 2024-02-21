import type { AppProps } from "next/app";
import { K2D } from "next/font/google";

import "@/styles/globals.css";
import Header from "@/components/header";
import WalletContextProvider from "@/components/wallet-context-provider";

const k2d = K2D({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={k2d.className}>
      <WalletContextProvider>
        <Header />
        <Component {...pageProps} />
      </WalletContextProvider>
    </main>
  );
}
