import { Request, Response } from "express";
import { executeTrade } from "../../exchange/uniswap/uniswap";

export async function executeTradeControl(req: Request, res: Response) {
  console.log("API Clear");

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let trade = req.body;

  console.log(trade);

  const result = await executeTrade(trade);

  console.log(result);

  if (result) {
    res.status(200).json({
      cancelledOrder: result,
    });
  } else {
    res.status(400).json({ detail: "No orders to cancel" });
  }
}
