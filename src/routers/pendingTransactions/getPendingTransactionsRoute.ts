import { Router } from "express";
import { getPendingTransactions } from "../../controllers/transactions/getPendingTransactionsController";

class getPendingTransactionsRouter {
  private _router = Router();
  private _controller = getPendingTransactions;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.get("/", this._controller);
  }
}

export default new getPendingTransactionsRouter().router;
