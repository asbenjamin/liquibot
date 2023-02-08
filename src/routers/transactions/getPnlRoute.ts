import { Router } from "express";
import { getPnl } from "../../controllers/transactions/getPnl";

class getPnlRouter {
  private _router = Router();
  private _controller = getPnl;

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

export default new getPnlRouter().router;
