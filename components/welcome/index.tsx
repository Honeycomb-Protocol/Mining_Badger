import React from "react";

import Footer from "../footer";
import WalletConnectButton from "../wallet-context-provider/wallet-connect-button";

const WelcomePage = () => {
  return (
    <main className="flex flex-col justify-between items-center w-full min-h-[78vh]">
      <div />
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-[50px]">WELCOME TO THE GAME</h1>
        <WalletConnectButton />
      </div>
      <Footer />
    </main>
  );
};

export default WelcomePage;
