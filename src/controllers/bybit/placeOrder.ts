import { Request, Response } from "express";
import { bybitService } from "../../utils/initBybit";

export async function placeOrder(req: Request, res: Response) {
  console.log("API Clear");

  const apiInfo = await bybitService.getApiInfo();
  const assetPrice = await bybitService.getAssetPrice(req.body.symbol);
  const lastTradedPrice = await bybitService.getLastTradedPrice(
    req.body.symbol
  );
  const walletBalances = await bybitService.getBalance();

  if (!req.body) {
    res.status(502).json({ error: "No request body" });
  }

  let { symbol, side, order_type, qty, time_in_force, close_on_trigger } =
    req.body;

  let reduce_only = side === "Buy" ? false : true;

  let price =
    side === "Buy"
      ? lastTradedPrice.lastTradedPrice - 3.05
      : lastTradedPrice.lastTradedPrice + 3.05;

  let result;
  if (order_type === "Market") {
    result = await bybitService.placeOrder(
      symbol,
      side,
      order_type,
      qty,
      time_in_force,
      typeof price !== "undefined" ? price : undefined,
      reduce_only,
      close_on_trigger
    );
  } else
    result = await bybitService.placeOrder(
      symbol,
      side,
      order_type,
      qty,
      time_in_force,
      price,
      reduce_only,
      close_on_trigger
    );

  if (result) {
    console.log("Position opened");
    let params = {
      orderId: result.order_id,
      symbol: result.symbol,
      side: result.side,
    };
    await bybitService.chaseOrder(params);

    res.status(200).json({
      orderPlaced: result,
      apiInfo: apiInfo,
      assetPrice: assetPrice,
      lastTradedPrice: lastTradedPrice,
      walletBalances: walletBalances,
    });
  } else
    res
      .status(400)
      .json({ msg: "An error occured, try placing an order again" });
}
