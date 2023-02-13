import { Router } from "express";
import { getWalletBalance } from "../../controllers/bybit/getWalletBalances";

class getWalletBalanceRouter {
  private _router = Router();
  private _controller = getWalletBalance;

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

export default new getWalletBalanceRouter().router;
