import {
  LinearClient,
  LinearOrder,
  RestClientOptions,
  SymbolIntervalFromLimitParam,
} from "bybit-api";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { Configs } from "../../config";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

export async function placeOrder(req: Request, res: Response) {
  console.log("API Clear");

  const apiInfo = await bybitService.getApiInfo();

  const assetPrice = await bybitService.getAssetPrice(req.body.symbol);

  const lastTradedPrice = await bybitService.getLastTradedPrice(
    req.body.symbol
  );

  const walletBalances = await bybitService.getBalance();

  let price = lastTradedPrice.lastTradedPrice;

  const {
    symbol,
    side,
    order_type,
    qty,
    time_in_force,
    reduce_only,
    close_on_trigger,
  } = req.body;

  const result = await bybitService.placeOrder(
    symbol,
    side,
    order_type,
    qty,
    time_in_force,
    price,
    reduce_only,
    close_on_trigger
  );
  console.log(result);
  console.log("price", price);

  res.status(200).json({
    orderPlaced: result,
    apiInfo: apiInfo,
    assetPrice: assetPrice,
    lastTradedPrice: lastTradedPrice,
    walletBalances: walletBalances,
  });
}

class BybitService {
  private linear: LinearClient;

  constructor(options: RestClientOptions) {
    this.linear = new LinearClient(options);
  }

  public async placeOrder(
    symbol: string,
    side: any,
    order_type: any,
    qty: number,
    time_in_force: any,
    price?: number,
    reduce_only: boolean = false,
    close_on_trigger: boolean = false
  ): Promise<LinearOrder | null> {
    const { result, ext_info, ret_code } = await this.linear.placeActiveOrder({
      symbol,
      side,
      order_type,
      qty,
      time_in_force,
      price,
      reduce_only,
      close_on_trigger,
    });
    if (ret_code === 130021) {
      console.log(ext_info);
    } else if (ret_code === 0) {
      return result;
    }
    return null;
  }

  public async getApiInfo() {
    const res = await this.linear.getApiKeyInfo();
    return res;
  }

  public async getMarkPriceKlineData(params: SymbolIntervalFromLimitParam) {
    const res = await this.linear.getMarkPriceKline(params);
    return res;
  }

  public async getAssetPrice(symbol: string) {
    const res = await this.linear.getOrderBook({ symbol });
    const ask = res.result[0].price;
    const sym = res.result[0].symbol;
    const side = res.result[0].side;
    const size = res.result[0].size;
    return { askPrice: ask, symbol: sym, side: side, size: size };
  }

  public async getLastTradedPrice(symbol: string) {
    const res = await this.linear.getTickers({ symbol });
    const lastTradedPrice = res.result?.[0]?.last_price;
    return { res, lastTradedPrice };
  }

  public async getBalance() {
    const res = await this.linear.getWalletBalance();
    return res.result;
  }
}

const bybitService = new BybitService({
  key: Configs.key,
  secret: Configs.secret,
  baseUrl: Configs.baseUrl,
  testnet: true,
});
