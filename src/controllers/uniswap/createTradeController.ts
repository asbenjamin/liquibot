import { Request, Response } from "express";
import { buyTokenUniswap } from "../../exchange/uniswap";
import { createTrade } from "../../exchange/uniswap/uniswap";
import { getPrice } from "../../exchange/uniswap3";

export async function createTradeControl(req: Request, res: Response) {
  console.log("API Clear");

  const { inputAmount, slippageAmount, deadline, walletAddress } = req.body;

  const result = await getPrice(
    inputAmount,
    slippageAmount,
    deadline,
    walletAddress
  );

  console.log(result);

  if (result) {
    res.status(200).json({
      trade: result,
    });
  } else {
    res.status(400).json({ detail: "No trade" });
  }
}
