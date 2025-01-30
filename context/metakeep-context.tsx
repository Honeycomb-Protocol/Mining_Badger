import base58 from "bs58";
import { MetaKeep } from "metakeep";
import { PublicKey } from "@solana/web3.js";
import React, { createContext, useContext, useEffect, useState } from "react";

import { connection } from "@/config/config";

interface ProxyAdapter {
  connected: boolean;
  publicKey: PublicKey;
  signMessage: (message: Uint8Array, reason?: string) => Promise<Uint8Array>;
  signTransaction: (tx: any, reason?: string) => Promise<any>;
  signAllTransactions: (txs: any[], reason?: string) => Promise<any[]>;
  sendTransaction: (tx: any) => Promise<any>;
}

const MetakeepContext = createContext<{
  metakeepCache: ProxyAdapter | null;
  setMetakeepCache: (user: { publicKey: string; email: string }) => void;
  clearMetakeepCache: () => void;
}>({
  metakeepCache: null,
  setMetakeepCache: () => {},
  clearMetakeepCache: () => {},
});

export const MetakeepProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [metakeepCache, setMetakeepCacheState] = useState<ProxyAdapter | null>(
    null
  );

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const loadFromLocalStorage = (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const setMetakeepCache = (user: { publicKey: string; email: string }) => {
    const sdk = new MetaKeep({
      appId: process.env.NEXT_PUBLIC_METAKEEP_APP_ID!,
      user: {
        email: user.email,
      },
    });

    const proxyAdapter: ProxyAdapter = {
      connected: true,
      publicKey: new PublicKey(user.publicKey),
      signMessage: async (message: Uint8Array, reason?: string) => {
        return new Promise(async (resolve, reject) => {
          try {
            const decodedMessage = new TextDecoder().decode(message);
            const response = await sdk.signMessage(
              decodedMessage,
              reason || "Sign this message for login"
            );
            let signatureBytes: Uint8Array;
            signatureBytes = Uint8Array.from(
              Buffer.from(response.signature.slice(2), "hex")
            );
            resolve(signatureBytes);
          } catch (error) {
            console.error("🚨 Error signing message:", error);
            reject(error);
          }
        });
      },
      signTransaction: async (tx: any, reason?: string) => {
        const transactionResponse = await sdk.signTransaction(
          tx,
          reason || "Sign this transaction"
        );
        tx.addSignature(
          new PublicKey(user.publicKey),
          Buffer.from(transactionResponse?.signature.slice(2), "hex")
        );
        return tx;
      },
      signAllTransactions: async (txs: any[], reason?: string) => {
        const signedTransactions = await Promise.all(
          txs.map(async (tx) => {
            const transactionResponse = await sdk.signTransaction(
              tx,
              reason || "Sign this transaction"
            );
            tx.addSignature(
              new PublicKey(user.publicKey),
              Buffer.from(transactionResponse?.signature.slice(2), "hex")
            );
            return tx;
          })
        );
        return signedTransactions;
      },
      sendTransaction: async (tx: any) => {
        const transactionResponse = await sdk.signTransaction(
          tx,
          "Sign this transaction"
        );
        tx.addSignature(
          new PublicKey(user.publicKey),
          Buffer.from(transactionResponse?.signature.slice(2), "hex")
        );
        const signature = await connection.sendRawTransaction(tx.serialize());
        return await connection.confirmTransaction(signature).then((res) => {
          if (res.value.err) {
            throw res.value.err;
          } else {
            return signature;
          }
        });
      },
    };

    saveToLocalStorage("metakeepUser", {
      publicKey: user.publicKey,
      email: user.email,
    });
    setMetakeepCacheState(proxyAdapter);
  };

  const clearMetakeepCache = () => {
    setMetakeepCacheState(null);
    localStorage.removeItem("metakeepUser");
  };

  useEffect(() => {
    const storedUser = loadFromLocalStorage("metakeepUser");
    if (storedUser) {
      setMetakeepCache(storedUser);
    }
  }, []);

  return (
    <MetakeepContext.Provider
      value={{
        metakeepCache,
        setMetakeepCache,
        clearMetakeepCache,
      }}
    >
      {children}
    </MetakeepContext.Provider>
  );
};

export const useMetakeep = () => useContext(MetakeepContext);
