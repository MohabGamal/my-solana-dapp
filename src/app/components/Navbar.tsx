"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };
    getBalance();
  }, [publicKey, connection]);

  const airdropSol = async () => {
    if (!publicKey) {
      alert("Please connect your wallet");
      return;
    }
    try {
      // Request airdrop of 1 SOL
      const signature = await connection.requestAirdrop(publicKey, 1e9); // 1 SOL in lamports
      await connection.confirmTransaction(signature, "processed");
      alert("Airdrop successful: 1 SOL added");

      // Update balance
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9);
    } catch (error) {
      console.error("Airdrop failed:", error);
      alert("Airdrop failed. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Solana DApp</h1>
          </div>
          <div className="flex items-center">
            {publicKey ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {publicKey.toBase58().slice(0, 8)}...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Balance:{" "}
                    {balance !== null
                      ? `${balance.toFixed(4)} SOL`
                      : "Loading..."}
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={airdropSol}>
                    Request Airdrop
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnect}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <WalletMultiButton
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{}}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
