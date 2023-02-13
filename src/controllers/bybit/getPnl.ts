import { Request, Response } from "express";
import { bybitService } from "../../utils/initBybit";

export async function getPnl(req: Request, res: Response) {
  console.log("API Clear");

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let { symbol, order_id } = req.body;

  const pnl = await bybitService.getPnl(symbol);

  console.log(pnl);

  if (pnl) {
    res.status(200).json({
      order_id: order_id,
      pnl: pnl,
    });
  } else res.status(401).json({ msg: "An error occured, modify something" });
}
