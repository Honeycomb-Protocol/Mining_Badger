import { useEffect } from 'react';
import {
  useHoneycomb,
} from '../hooks';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Effects() {
  const wallet = useWallet();
  const {
    honeycomb,
    init: initHoneycomb,
    setIdentity,
  } = useHoneycomb();

  useEffect(() => {

    (async () => {
      console.log("EFFECT: Fetching Honeycomb");
      await initHoneycomb();
    })();
  }, []);


  useEffect(() => {
    if (!honeycomb) return;
    // console.log('EFFECT 2: Setting Wallet');
    setIdentity(wallet);
  }, [wallet, honeycomb]);


  return (
    <>
    </>
  );
}
