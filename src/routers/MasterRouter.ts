import { Router } from "express";
import getPendingTransactionsRouter from "./pendingTransactions/getPendingTransactionsRoute";

class MasterRouter {
  private _router = Router();
  private _getPendingTransactionsRouter = getPendingTransactionsRouter;

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
  }
}

export = new MasterRouter().router;
