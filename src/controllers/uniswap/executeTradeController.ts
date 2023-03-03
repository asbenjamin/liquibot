import { Token, TradeType } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/v3-sdk";
import { Request, Response } from "express";
import { executeTrade, TokenTrade } from "../../exchange/uniswap/uniswap";

export async function executeTradeControl(req: Request, res: Response) {
  console.log("API Clear");

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let trade: Trade<Token, Token, TradeType> = req.body;

  console.log("---------------------", trade);

  const result = await executeTrade(trade);

  console.log(result);

  if (result) {
    res.status(200).json({
      executedTrade: result,
    });
  } else {
    res.status(400).json({ detail: "No trade executedu" });
  }
}
