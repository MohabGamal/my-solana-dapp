"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import { Button } from "../components/ui/button";

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const getBalance = async () => {
    if (publicKey) {
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9); // Convert lamports to SOL
    }
  };

  const sendSol = async () => {
    if (!publicKey) {
      alert("Please connect your wallet");
      return;
    }
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // ex. devnet address
        lamports: 1000000, // 0.001 SOL
      })
    );
    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      alert("Transaction successful");

      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });

      getBalance();
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Solana DApp</h1>
        {publicKey && (
          <div>
            <p className="mb-2 text-gray-700">
              Wallet: {publicKey.toBase58().slice(0, 8)}...
            </p>
            <Button onClick={getBalance} className="mb-2 w-full">
              Get Balance
            </Button>
            {balance !== null && (
              <p className="mb-2 text-gray-700">
                Balance: {balance.toFixed(4)} SOL
              </p>
            )}
            <Button onClick={sendSol} className="w-full">
              Send 0.001 SOL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
