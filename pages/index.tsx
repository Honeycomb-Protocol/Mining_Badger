import Button from "@/components/common/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-between items-center w-full min-h-[78vh]">
      <div />
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-[50px]">WELCOME TO THE GAME</h1>
        <div className="mb-6 mt-4">
          <p className="text-lg">TO BEGIN THE MINING ADVENTURE </p>
        </div>
        <Button
          styles="w-96"
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
