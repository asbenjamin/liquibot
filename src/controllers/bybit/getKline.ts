import { Request, Response } from "express";
import { bybitService } from "../../utils/initBybit";

export async function getKline(req: Request, res: Response) {
  console.log("API Clear");

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let { symbol, interval, date_body } = req.body;

  console.log(typeof(interval))
  const date_in = new Date(date_body);
  console.log(date_in)
  const from = Math.floor(date_in.getTime() / 1000);
  console.log(from)

  const params = { symbol, interval, from };

  const kline = await bybitService.getKlineData(params);

  console.log(kline);

  if (kline) {
    res.status(200).json({
      klinedata: kline.result
    });
  } else res.status(401).json({ msg: "An error occured, modify something" });
}
