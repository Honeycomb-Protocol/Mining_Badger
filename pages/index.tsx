import Button from "@/components/common/button";

export default function Home() {
  //console connection every time it gets connected

  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect } = useWallet();
  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    console.log("Connection to cluster established:", connection);
    console.log("Public key:", publicKey.toBase58());

    // Ensure the balance updates after the transaction completes
  }, [connection, publicKey]);

  return (
    <main className="flex flex-col justify-between items-center w-full min-h-[78vh]">
      <div />
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-[50px]">WELCOME TO THE GAME</h1>
        <Button
          styles="w-96 mt-12"
          btnText="Connect Wallet"
          loading={false}
          onClick={() => {
            console.log("hello");
          }}
        />
      </div>
      <div />
    </main>
  );
}
