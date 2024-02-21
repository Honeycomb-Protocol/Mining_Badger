import type { AppProps } from "next/app";
import { K2D } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

import "@/styles/globals.css";
import Header from "@/components/header";

const k2d = K2D({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <main className={k2d.className}>
        <Header />
        <Component {...pageProps} />
      </main>
    </NextUIProvider>
  );
}
