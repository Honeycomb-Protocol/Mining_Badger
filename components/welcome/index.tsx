import React, { useEffect } from "react";

import Footer from "../footer";
import WalletConnectButton from "../wallet-context-provider/wallet-connect-button";

const WelcomePage = () => {
  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/assets/images/main-bg.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
    document.body.style.backgroundRepeat = "no-repeat";
  }, []);

  return (
    <main className="flex flex-col justify-between items-center w-full min-h-[78vh]">
      <div />
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-[50px]">TO BEGIN THE MINING ADVENTURE</h1>
        <WalletConnectButton />
      </div>
      <Footer />
    </main>
  );
};

export default WelcomePage;
