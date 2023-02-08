import {
  LinearClient,
  LinearOrder,
  PerpPosition,
  RestClientOptions,
  SymbolIntervalFromLimitParam,
} from "bybit-api";
import { IPosition } from "../types";

export class BybitService {
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
    let { result, ret_msg, ret_code } = await this.linear.placeActiveOrder({
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
      throw new Error(ret_msg); // find a way to add this error to the front end
    } else if (ret_code === 0) {
      return result;
    }
    // throw new Error(ret_msg);
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

  public async getPnl(symbol: string): Promise<IPosition | null> {
    let { result, ret_msg, ret_code }: any = await this.linear.getPosition({
      symbol,
    });

    if (ret_code === 0) {
      return result;
    } else {
      throw new Error(ret_msg);
    }
  }

  public async cancelOrders(symbol: string) {
    const result = await this.linear.cancelAllActiveOrders({
      symbol,
    });
    return result;
  }

  public async cancelSingleOrder(symbol: string, order_id: string) {
    const result = await this.linear.cancelActiveOrder({
      symbol,
      order_id,
    });
    return result;
  }

  public async replaceActiveOrder(order_id: string, symbol: string) {
    const result = await this.linear.replaceActiveOrder({
      order_id,
      symbol,
    });
  }
}
