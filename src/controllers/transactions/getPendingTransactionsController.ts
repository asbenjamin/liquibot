import { ethers } from "ethers";
import { Request, Response } from "express";
import dotenv from "dotenv";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

const API_KEY = process.env.API_KEY!;

export async function getPendingTransactions(req: Request, res: Response) {
  const provider = new ethers.providers.WebSocketProvider(
    `wss://goerli.infura.io/ws/v3/${API_KEY}`
  );

  try {
    const transactions: any = [];

    provider.on("pending", async (tx) => {
      const txtInfo = await provider.getTransaction(tx);

      if (txtInfo && txtInfo.to && txtInfo.data != "0x") {
        transactions.push({ txtInfo});
      }
    });

    setTimeout(() => {
      provider.removeAllListeners();
      if (transactions.length > 0) {
        res.status(200).json(transactions);
      } else {
        res.status(400).json({
          message: "No pending transactions found",
        });
      }
    }, 5000);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(400).json({
      message: "An error occurred",
      error: error,
    });
  }
}
