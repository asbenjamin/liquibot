import { Request, Response } from "express";
import { bybitService } from "../../utils/initBybit";

export async function cancelOrders(req: Request, res: Response) {
  console.log("API Clear");

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let { symbol } = req.body;

  const { result, ret_code, ret_msg } = await bybitService.cancelOrders(symbol);

  console.log(result);

  if (ret_code === 0 && result.length !== 0) {
    res.status(200).json({
      cancelledOrder: result,
    });
  } else if (ret_code === 0 && result.length === 0) {
    res.status(400).json({ detail: "No orders to cancel" });
  } else res.status(400).json({ ret_code: ret_code, ret_msg: ret_msg });
}
