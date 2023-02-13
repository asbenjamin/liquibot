import { Request, Response } from "express";
import { bybitService } from "../../utils/initBybit";

export async function getWalletBalance(req: Request, res: Response) {
  console.log("API Clear");

  const walletBalances = await bybitService.getBalance();

  if (walletBalances) {
    res.status(200).json({
      balance: walletBalances
    });
  } else res.status(401).json({ msg: "An error occured, modify something" });
}
