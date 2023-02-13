import { Request, Response } from "express";
import { Configs } from "../../config";
import { bybitService } from "../../utils/initBybit";
import { sendMessage } from "../../utils/telegraf/botInit";

export async function getWalletBalance(req: Request, res: Response) {
  console.log("API Clear");

  const walletBalances = await bybitService.getBalance();

  if (walletBalances) {
    res.status(200).json({
      balance: walletBalances
    });
    sendMessage(Configs.bybit_bot_chat_id, `USDT Balance - ${(walletBalances.result["USDT"]?.available_balance)?.toString()}`);
  } else res.status(401).json({ msg: "An error occured, modify something" });
}
