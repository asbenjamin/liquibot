import { Router } from "express";
import cancelOrderRoute from "./transactions/cancelOrderRoute";
import cancelSingleOrderRoute from "./transactions/cancelSingleOrderRoute";
import executeTradeRoute from "./transactions/executeTradeRoute";
import getKlineData from "./transactions/getKlineDataRoute";
import getPendingTransactionsRouter from "./transactions/getPendingTransactionsRoute";
import getPnlRoute from "./transactions/getPnlRoute";
import getWalletBalanceRoute from "./transactions/getWalletBalanceRoute";
import placeOrderRoute from "./transactions/placeOrdersRoute";

class MasterRouter {
  private _router = Router();
  private _getPendingTransactionsRouter = getPendingTransactionsRouter;
  private _placeOrderRouter = placeOrderRoute;
  private _getPnlRouter = getPnlRoute;
  private _cancelOrders = cancelOrderRoute;
  private _cancelSingleOrder = cancelSingleOrderRoute;
  private _getKlineData = getKlineData;
  private _getWalletBalance = getWalletBalanceRoute;
  private _executeTrade = executeTradeRoute;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use("/pending-txns", this._getPendingTransactionsRouter);
    this._router.use("/place-order", this._placeOrderRouter);
    this._router.use("/get-pnl", this._getPnlRouter);
    this._router.use("/cancel-orders", this._cancelOrders);
    this._router.use("/cancel-single", this._cancelSingleOrder);
    this._router.use("/get-kline", this._getKlineData);
    this.router.use("/get-balance", this._getWalletBalance);
    this.router.use("/execute-trade", this._executeTrade);
  }
}

export = new MasterRouter().router;
