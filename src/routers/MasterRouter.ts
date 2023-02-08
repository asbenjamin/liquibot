import { Router } from "express";
import getPendingTransactionsRouter from "./pendingTransactions/getPendingTransactionsRoute";
import placeOrderRoute from "./pendingTransactions/placeOrderRoute";

class MasterRouter {
  private _router = Router();
  private _getPendingTransactionsRouter = getPendingTransactionsRouter;
  private _placeOrderRouter = placeOrderRoute

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
    this._router.use("/place-order", this._placeOrderRouter)
  }
}

export = new MasterRouter().router;
