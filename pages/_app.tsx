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

const k2d = K2D({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Provider store={store}>
        <Effects />
        <CheckConnection>
          <main className={k2d.className}>
            <NextUIProvider>
              <Header />

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
            </NextUIProvider>
          </main>
        </CheckConnection>
      </Provider>
    </WalletContextProvider>
  );
}
