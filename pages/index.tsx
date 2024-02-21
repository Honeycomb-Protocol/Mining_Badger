import Footer from "@/components/footer";
import WalletConnectButton from "@/components/wallet-context-provider/wallet-connect-button";

export default function Home() {
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
}
