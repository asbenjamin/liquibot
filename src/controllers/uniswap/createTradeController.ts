import { Request, Response } from "express";
import { createTrade } from "../../exchange/uniswap/uniswap";

export async function createTradeControl(req: Request, res: Response) {
  console.log("API Clear");

  const result = await createTrade();

  console.log(result);

  if (result) {
    res.status(200).json({
      trade: result,
    });
  } else {
    res.status(400).json({ detail: "No trade" });
  }
}
